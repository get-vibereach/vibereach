from django import forms
from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count, Sum
from django.contrib.admin import SimpleListFilter
from django.http import HttpResponseRedirect, JsonResponse
from django.contrib import messages
from django.core.exceptions import ValidationError
from django.urls import path
from urllib.parse import unquote

from campaign.email_sender import send_campaign_email
from .models import (
    LeadList, Product, Campaign, Lead,
    CampaignLead, Message, MessageAssignment, CampaignStats, Schedule, CampaignOptions, CampaignDailyStats
)
 
import logging
from django.conf import settings
from import_export.admin import ImportExportModelAdmin
from .resources import LeadResource

# Configure logger
logger = logging.getLogger(__name__)

@admin.register(CampaignOptions)
class CampaignOptionsAdmin(admin.ModelAdmin):
    list_display = ('campaign', 'open_tracking_enabled', 'link_tracking_enabled', 'daily_limit', 'stop_on_reply')
    list_filter = ('open_tracking_enabled', 'link_tracking_enabled', 'stop_on_reply')


# Admin configurations
@admin.register(CampaignStats)
class CampaignStatsAdmin(admin.ModelAdmin):
    list_display = (
        'campaign', 'total_leads', 'sequence_started_count',
        'opened_count', 'open_rate_percentage', 'clicked_count',
        'click_rate_percentage', 'replied_count', 'reply_rate_percentage',
        'opportunities_count', 'opportunity_value', 'conversions_count',
        'conversion_total_value', 'best_message', 'updated_at'
    )
    list_filter = ('campaign', 'updated_at')
    search_fields = ('campaign__name',)
    # Adding a button to manually trigger update_from_campaign
    actions = ['update_selected_campaign_stats']

    def update_selected_campaign_stats(self, request, queryset):
        for stats in queryset:
            stats.update_from_campaign()
        self.message_user(request, f"Successfully updated stats for {queryset.count()} campaign(s).")
    update_selected_campaign_stats.short_description = "Update selected Campaign Stats"



@admin.register(CampaignDailyStats)
class CampaignDailyStatsAdmin(admin.ModelAdmin):
    list_display = (
        'campaign', 'date', 'emails_sent_today', 'opens_today',
        'clicks_today', 'replies_today', 'opportunities_today',
        'conversions_today', 'opportunities_value_today',
        'conversions_value_today', 'total_emails_sent', 'total_opens',
        'total_clicks', 'total_replies', 'total_opportunities',
        'total_conversions', 'total_opportunities_value',
        'total_conversions_value'
    )
    list_filter = ('campaign', 'date')
    search_fields = ('campaign__name',)
    # Adding a button to manually trigger calculate_daily_stats for selected campaigns
    actions = ['calculate_daily_stats_for_selected']

    def calculate_daily_stats_for_selected(self, request, queryset):
        # We need to iterate over unique campaigns from the selected daily stats
        # or, better, provide a way to select campaigns and then calculate for them.
        # For simplicity, if we select DailyStats objects, we re-calculate for their campaign and date.
        
        # A more robust action might target Campaign objects directly for daily stats generation.
        # For this action, we'll re-run for the existing daily stats entries.
        updated_count = 0
        for daily_stats_entry in queryset:
            CampaignDailyStats.calculate_daily_stats(daily_stats_entry.campaign, daily_stats_entry.date)
            updated_count += 1
        self.message_user(request, f"Successfully recalculated daily stats for {updated_count} entries.")
    calculate_daily_stats_for_selected.short_description = "Recalculate daily stats for selected entries"


@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ('name', 'campaign', 'start_date', 'timing_from', 'timing_to', 'time_zone', 'days')


# Inline models for related objects
class CampaignLeadInline(admin.TabularInline):
    model = CampaignLead
    extra = 0
    fields = ('lead', 'is_converted', 'converted_at')

class MessageAssignmentInline(admin.TabularInline):
    model = MessageAssignment
    extra = 0
    fields = ('message', 'delayed_by_days', 'responded')

# Custom filter for Campaign selection
class CampaignFilter(SimpleListFilter):
    title = 'campaign'
    parameter_name = 'campaign'

    def lookups(self, request, model_admin):
        campaigns = Campaign.objects.all()
        return [(c.id, c.name) for c in campaigns]

    def queryset(self, request, queryset):
        if self.value():
            return queryset
        return queryset


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ('name', 'product', 'start_date', 'end_date', 'is_active', 'lead_count')
    list_filter = ('is_active', 'product', 'start_date')
    search_fields = ('name', 'short_name', 'product__name')
    inlines = [CampaignLeadInline]
    
    def lead_count(self, obj):
        return obj.campaignlead_set.count()
    lead_count.short_description = 'Leads'
    
@admin.register(LeadList)
class LeadListAdmin(admin.ModelAdmin):
    list_display = ('title', 'display_tags', 'display_campaigns')
    
    def display_tags(self, obj):
        return obj.tags if obj.tags else "-"
    display_tags.short_description = 'Tags'
    
    def display_campaigns(self, obj):
        return ", ".join([str(campaign) for campaign in obj.campaigns.all()]) or "-"
    display_campaigns.short_description = 'Campaigns'

@admin.register(Lead)
class LeadAdmin(ImportExportModelAdmin):
    resource_class = LeadResource
    list_display = ('full_name', 'email', 'company_name', 'lead_type', 'source', 'campaign_count')
    list_filter = ('lead_type', 'source', 'created_at')
    search_fields = ('full_name', 'email', 'company_name')
    fieldsets = (
        ('Owned By', {
            'fields': ('lead_list', 'subscribed_company')
        }),
        ('Personal Information', {
            'fields': ('full_name', 'first_name', 'last_name', 'position', 'email', 'phone_number', 'linkedin_profile')
        }),
        ('Company Information', {
            'fields': ('company_name', 'company_website', 'industry', 'employee_count')
        }),
        ('Lead Details', {
            'fields': ('source', 'lead_type')
        }),
    )
    
    def campaign_count(self, obj):
        return obj.campaignlead_set.count()
    campaign_count.short_description = 'Campaigns'
    
    def add_to_campaign(self, request, queryset):
        campaign_id = request.POST.get('campaign')
        
        if not campaign_id:
            self.message_user(request, "No campaign selected", level=messages.ERROR)
            return
            
        try:
            campaign = Campaign.objects.get(id=campaign_id)
            added_count = 0
            already_exists_count = 0
            
            for lead in queryset:
                try:
                    CampaignLead.objects.create(campaign=campaign, lead=lead)
                    added_count += 1
                except Exception:
                    already_exists_count += 1
            
            if added_count > 0:
                self.message_user(
                    request, 
                    f"Successfully added {added_count} leads to campaign '{campaign.name}'",
                    level=messages.SUCCESS
                )
            
            if already_exists_count > 0:
                self.message_user(
                    request,
                    f"{already_exists_count} leads were already in the campaign",
                    level=messages.WARNING
                )
                
        except Campaign.DoesNotExist:
            self.message_user(request, "Selected campaign does not exist", level=messages.ERROR)
        
    add_to_campaign.short_description = "Add selected leads to campaign"
    
    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['campaigns'] = Campaign.objects.all()
        return super().changelist_view(request, extra_context=extra_context)


class CampaignLeadForm(forms.ModelForm):
    class Meta:
        model = CampaignLead
        fields = '__all__'
    
    def clean(self):
        cleaned_data = super().clean()
        lead = cleaned_data.get('lead')
        campaign = cleaned_data.get('campaign')
        
        lead_type = self.data.get('lead_type')
        lead_source = self.data.get('lead_source')
        
        if lead_type or lead_source:
            self.fields['lead'].required = False
            if 'lead' in self._errors:
                del self._errors['lead']
        elif not lead:
            raise ValidationError({'lead': 'This field is required when not using filters.'})
        
        if not campaign:
            raise ValidationError({'campaign': 'This field is required.'})
        
        return cleaned_data

@admin.register(CampaignLead)
class CampaignLeadAdmin(admin.ModelAdmin):
    form = CampaignLeadForm
    list_display = ('lead', 'lead__lead_list', 'campaign', 'is_converted', 'total_clicks', 'converted_at', 'created_at')
    list_filter = ('is_converted', 'campaign', 'created_at')
    search_fields = ('lead__full_name', 'lead__email', 'campaign__name')
    inlines = [MessageAssignmentInline]
    
    def total_clicks(self, obj):
        """Calculate total clicks from all message assignments for this lead."""
        result = obj.messageassignment_set.aggregate(total=Sum('visit_count'))
        return result['total'] or 0
    total_clicks.short_description = 'Total Clicks'
    
    def add_view(self, request, form_url='', extra_context=None):
        extra_context = extra_context or {}
        extra_context['lead_types'] = dict(Lead.TYPE_CHOICES)
        extra_context['lead_sources'] = dict(Lead.SOURCE_CHOICES)
        
        self.change_form_template = 'admin/campaign/campaignlead/add_form.html'
        
        if request.method == 'POST':
            lead_type = request.POST.get('lead_type')
            lead_source = request.POST.get('lead_source')
            campaign_id = request.POST.get('campaign')
            lead_id = request.POST.get('lead')
            is_converted = request.POST.get('is_converted') == 'on'
            converted_at = request.POST.get('converted_at')
            
            if (lead_type or lead_source) and campaign_id:
                query = {}
                if lead_type:
                    query['lead_type'] = lead_type
                if lead_source:
                    query['source'] = lead_source
                
                leads = Lead.objects.filter(**query)
                
                if not leads.exists():
                    messages.warning(request, "No leads match the selected filters.")
                else:
                    campaign = Campaign.objects.get(id=campaign_id)
                    added_count = 0
                    already_exists_count = 0
                    
                    for lead in leads:
                        if CampaignLead.objects.filter(campaign=campaign, lead=lead).exists():
                            already_exists_count += 1
                            continue
                        
                        CampaignLead.objects.create(
                            campaign=campaign,
                            lead=lead,
                            is_converted=is_converted,
                            converted_at=converted_at if converted_at else None
                        )
                        added_count += 1
                    
                    if added_count > 0:
                        messages.success(request, f"Successfully added {added_count} leads to campaign '{campaign.name}'")
                    
                    if already_exists_count > 0:
                        messages.warning(request, f"{already_exists_count} leads were already in the campaign")
                    
                    return HttpResponseRedirect("../")
            
            elif campaign_id and lead_id:
                try:
                    campaign = Campaign.objects.get(id=campaign_id)
                    lead = Lead.objects.get(id=lead_id)
                    
                    if CampaignLead.objects.filter(campaign=campaign, lead=lead).exists():
                        messages.warning(request, f"Lead '{lead.full_name}' is already in campaign '{campaign.name}'")
                    else:
                        CampaignLead.objects.create(
                            campaign=campaign,
                            lead=lead,
                            is_converted=is_converted,
                            converted_at=converted_at if converted_at else None
                        )
                        messages.success(request, f"Successfully added lead '{lead.full_name}' to campaign '{campaign.name}'")
                    
                    if '_addanother' in request.POST:
                        return HttpResponseRedirect(".")
                    else:
                        return HttpResponseRedirect("../")
                except (Campaign.DoesNotExist, Lead.DoesNotExist) as e:
                    messages.error(request, str(e))
        
        return super().add_view(request, form_url, extra_context)
    
    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('subject', 'product', 'cta', 'message_preview')
    search_fields = ('subject', 'content', 'cta')
    
    def message_preview(self, obj):
        if len(obj.content) > 50:
            return obj.content[:50] + "..."
        return obj.content
    message_preview.short_description = 'Content Preview'


class MessageAssignmentAdminForm(forms.ModelForm):
    create_for_all_leads = forms.BooleanField(
        required=False,
        label="Create for all campaign leads",
        help_text="If checked, this message will be assigned to all leads in the selected campaign who don't have it yet."
    )
    
    class Meta:
        model = MessageAssignment
        fields = '__all__'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['campaign_lead'].required = False
        
        if self.instance and self.instance.pk:
            self.fields['create_for_all_leads'].widget = forms.HiddenInput()
            
    def clean(self):
        cleaned_data = super().clean()
        campaign_lead = cleaned_data.get('campaign_lead')
        create_for_all_leads = cleaned_data.get('create_for_all_leads')
        campaign = cleaned_data.get('campaign')
        
        if create_for_all_leads and not campaign:
            self.add_error('campaign', 'Please select a campaign when creating assignments for all leads.')
            
        if not create_for_all_leads and not campaign_lead and not campaign:
            self.add_error('campaign_lead', 'Either Campaign Lead or Campaign must be selected.')
            
        return cleaned_data


@admin.register(MessageAssignment)
class MessageAssignmentAdmin(admin.ModelAdmin):
    form = MessageAssignmentAdminForm
    list_display = ('id', 'campaign_lead', 'message', 'link_details', 'delayed_by_days', 'sent', 'opened', 'responded', 'sent_at')
    list_filter = ('campaign', 'responded', 'delayed_by_days', 'sent_at', 'sent')
    search_fields = ('campaign_lead__lead__full_name', 'message__subject')
    
    add_form_template = 'admin/campaign/messageassignment/add_form.html'
    change_form_template = 'admin/campaign/messageassignment/change_form.html'
    
    fieldsets = (
        ('Message Assignment', {
            'fields': ('campaign', 'campaign_lead', 'message', 'create_for_all_leads', 'personlized_msg_tmp', 'personlized_msg_to_send', 'delayed_by_days', 'sent', 'sent_at', 'opened', 'opened_at', 'link', 'visit_count', 'visited_at', 'responded', 'responded_at', 'responded_content')
        }),
    )
    
    actions = ['personalize_selected_messages', 'send_selected_messages']
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('get-campaign-leads/', self.admin_site.admin_view(self.get_campaign_leads), name='get_campaign_leads'),
            path('get-campaign-messages/', self.admin_site.admin_view(self.get_campaign_messages), name='get_campaign_messages'),
            path('<int:message_id>/personalize/', self.admin_site.admin_view(self.personalize_message), name='personalize_message'),
            path('<int:message_id>/send/', self.admin_site.admin_view(self.send_message), name='send_message'),
        ]
        return custom_urls + urls
    
    def get_campaign_leads(self, request):
        campaign_id = request.GET.get('campaign_id')
        if not campaign_id:
            return JsonResponse({'error': 'No campaign ID provided'}, status=400)
        
        campaign_leads = CampaignLead.objects.filter(campaign_id=campaign_id)
        leads_data = [{'id': cl.id, 'text': str(cl)} for cl in campaign_leads]
        
        return JsonResponse({'campaign_leads': leads_data})
    
    def get_campaign_messages(self, request):
        campaign_id = request.GET.get('campaign_id')
        if not campaign_id:
            return JsonResponse({'error': 'No campaign ID provided'}, status=400)
        
        try:
            campaign = Campaign.objects.get(id=campaign_id)
            messages = Message.objects.filter(product=campaign.product)
            messages_data = [{'id': m.id, 'text': str(m)} for m in messages]
            return JsonResponse({'messages': messages_data})
        except Campaign.DoesNotExist:
            return JsonResponse({'error': 'Campaign not found'}, status=404)
    
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        campaign_id = request.GET.get('campaign')
        
        if request.method == 'POST':
            campaign_id = request.POST.get('campaign')
        
        if not campaign_id and obj and obj.campaign:
            campaign_id = obj.campaign.id
            
        if campaign_id:
            form.base_fields['campaign_lead'].queryset = CampaignLead.objects.filter(campaign_id=campaign_id)
            try:
                campaign = Campaign.objects.get(id=campaign_id)
                form.base_fields['message'].queryset = Message.objects.filter(product=campaign.product)
            except Campaign.DoesNotExist:
                form.base_fields['message'].queryset = Message.objects.none()
        else:
            form.base_fields['campaign_lead'].queryset = CampaignLead.objects.none()
            form.base_fields['message'].queryset = Message.objects.all()
            
        return form
    
    def link_details(self, obj):
        if obj.link:
            visit_count = obj.visit_count
            visit_text = f"{visit_count} visit{'s' if visit_count != 1 else ''}"
            display_link = (obj.link[:70] + '...') if len(obj.link) > 70 else obj.link
            return format_html(
                '<a href="{}" target="_blank" title="{}">{}</a> ({})',
                obj.link, obj.link, display_link, visit_text
            )
        return "No link"
    link_details.short_description = 'Tracking Link'
    
    def save_model(self, request, obj, form, change):
        create_for_all_leads = form.cleaned_data.get('create_for_all_leads')
        campaign = form.cleaned_data.get('campaign')
        
        if create_for_all_leads and not change:
            message = obj.message
            if not campaign:
                self.message_user(request, "Please select a campaign.", level=messages.ERROR)
                request._message_assignment_handled = True
                return

            campaign_leads = CampaignLead.objects.filter(campaign=campaign).exclude(
                id__in=MessageAssignment.objects.filter(campaign=campaign, message=message).values('campaign_lead_id')
            )
            
            if campaign_leads.exists():
                assignments_to_create = [
                    MessageAssignment(
                        campaign=campaign,
                        campaign_lead=lead,
                        message=message,
                        delayed_by_days=obj.delayed_by_days,
                        link=campaign.product.landing_page_url
                    ) for lead in campaign_leads
                ]
                MessageAssignment.objects.bulk_create(assignments_to_create)
                self.message_user(request, f"Created {len(assignments_to_create)} message assignments for '{campaign.name}'.", level=messages.SUCCESS)
            else:
                self.message_user(request, f"All leads in '{campaign.name}' already have this message assigned.", level=messages.WARNING)
            
            request._message_assignment_handled = True
            return

        if not change:
            if obj.campaign_lead and MessageAssignment.objects.filter(campaign_lead=obj.campaign_lead, message=obj.message).exists():
                self.message_user(request, f"Lead '{obj.campaign_lead.lead}' already has this message.", level=messages.WARNING)
                request._message_assignment_handled = True
                return

            if obj.campaign_lead and not obj.link:
                obj.link = obj.campaign_lead.campaign.product.landing_page_url

        super().save_model(request, obj, form, change)

    def response_add(self, request, obj, post_url_continue=None):
        if hasattr(request, '_message_assignment_handled'):
            return HttpResponseRedirect("../")
        return super().response_add(request, obj, post_url_continue)
    
    def personalize_message(self, request, message_id):
        try:
            message_assignment = self.model.objects.get(id=message_id)
            from campaign.tasks import personalize_message_task
            task = personalize_message_task.delay(message_id)
            self.message_user(
                request, 
                f"Scheduled personalization task (ID: {task.id}) for {message_assignment.campaign_lead}",
                level=messages.SUCCESS
            )
        except self.model.DoesNotExist:
            self.message_user(request, f"Message assignment with ID {message_id} does not exist", level=messages.ERROR)
        except Exception as e:
            self.message_user(request, f"Error scheduling personalization task: {str(e)}", level=messages.ERROR)
        return HttpResponseRedirect(f"../../../campaign/messageassignment/{message_id}/change/")

    def personalize_selected_messages(self, request, queryset):
        try:
            from campaign.tasks import personalize_message_task
            count = 0
            for message_assignment in queryset:
                personalize_message_task.delay(message_assignment.id)
                count += 1
            self.message_user(
                request, 
                f"Scheduled personalization tasks for {count} messages",
                level=messages.SUCCESS
            )
        except Exception as e:
            self.message_user(request, f"Error scheduling personalization tasks: {str(e)}", level=messages.ERROR)
    personalize_selected_messages.short_description = "Personalize selected messages with AI"
    
    def send_message(self, request, message_id):
        try:
            message_assignment = self.model.objects.get(id=message_id)
            
            if not message_assignment.personlized_msg_to_send:
                self.message_user(request, f"Message assignment ID {message_id} has no personalized content", level=messages.ERROR)
                return HttpResponseRedirect(f"../../../campaign/messageassignment/{message_id}/change/")
                
            if message_assignment.sent:
                self.message_user(request, f"Message assignment ID {message_id} has already been sent", level=messages.WARNING)
                return HttpResponseRedirect(f"../../../campaign/messageassignment/{message_id}/change/")
            
            from campaign.tasks import send_email_task
            task = send_email_task.delay(message_id)
            
            self.message_user(
                request, 
                f"Scheduled email sending task (ID: {task.id}) for {message_assignment.campaign_lead.lead.email}",
                level=messages.SUCCESS
            )
                
        except self.model.DoesNotExist:
            self.message_user(request, f"Message assignment with ID {message_id} does not exist", level=messages.ERROR)
        except Exception as e:
            self.message_user(request, f"Error scheduling email sending task: {str(e)}", level=messages.ERROR)
        
        return HttpResponseRedirect(f"../../../campaign/messageassignment/{message_id}/change/")

    def send_selected_messages(self, request, queryset):
        try:
            queryset = queryset.filter(
                personlized_msg_to_send__isnull=False,
                personlized_msg_to_send__gt='',
                sent=False
            )
            
            if not queryset.exists():
                self.message_user(
                    request, 
                    "No messages selected that are personalized and not yet sent",
                    level=messages.WARNING
                )
                return
                
            from campaign.tasks import send_email_task
            count = 0
            for message_assignment in queryset:
                send_email_task.delay(message_assignment.id)
                count += 1
            
            self.message_user(
                request, 
                f"Scheduled email sending tasks for {count} messages",
                level=messages.SUCCESS
            )
        except Exception as e:
            self.message_user(request, f"Error scheduling email sending tasks: {str(e)}", level=messages.ERROR)
    send_selected_messages.short_description = "Send emails for selected messages"
    
    def change_view(self, request, object_id, form_url='', extra_context=None):
        extra_context = extra_context or {}
        extra_context['show_personalize_button'] = True
        
        # All of the dynamic JS for dropdowns is no longer needed in change_view,
        # as get_form handles the initial filtering correctly.
        # Keeping add_view's JS as it's useful for a blank form.
        
        return super().change_view(request, object_id, form_url, extra_context)

    def add_view(self, request, form_url='', extra_context=None):
        extra_context = extra_context or {}
        extra_context['campaign_lead_filter_js'] = """
        <script type="text/javascript">
            (function($) {
                $(document).ready(function() {
                    function updateDropdown(campaignId, targetSelector, url) {
                        var $targetSelect = $(targetSelector);
                        if (!campaignId) {
                            $targetSelect.empty().append('<option value="">---------</option>');
                            return;
                        }
                        
                        $targetSelect.prop('disabled', true);
                        
                        $.ajax({
                            url: url,
                            data: { 'campaign_id': campaignId },
                            dataType: 'json',
                            success: function(data) {
                                $targetSelect.empty().append('<option value="">---------</option>');
                                var options = data.campaign_leads || data.messages;
                                $.each(options, function(i, item) {
                                    $targetSelect.append($('<option></option>').val(item.id).text(item.text));
                                });
                                $targetSelect.prop('disabled', false);
                            },
                            error: function() {
                                $targetSelect.prop('disabled', false);
                            }
                        });
                    }
                    
                    $('#id_campaign').on('change', function() {
                        var campaignId = $(this).val();
                        updateDropdown(campaignId, '#id_campaign_lead', '/admin/campaign/messageassignment/get-campaign-leads/');
                        updateDropdown(campaignId, '#id_message', '/admin/campaign/messageassignment/get-campaign-messages/');
                    });
                    
                    var initialCampaignId = $('#id_campaign').val();
                    if (initialCampaignId) {
                        $('#id_campaign').trigger('change');
                         // The get_form method will handle pre-selecting the correct options on page load.
                    }
                });
            })(django.jQuery);
        </script>
        """
        return super().add_view(request, form_url, extra_context)