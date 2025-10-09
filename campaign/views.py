
from django.shortcuts import redirect, get_object_or_404, render
from django.http import Http404, HttpResponse, JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Count, Q, Min, Sum
from django.core.paginator import Paginator
import pytz

from campaign.utils import get_or_none, is_campaign_view_only
from .dicts import timezone_options, days_options, time_options
from django.core.serializers.json import DjangoJSONEncoder
import json


from campaign.helpers import get_campaign_status, get_campaigns_and_products, get_company_email_accounts, get_company_products, get_lead_lists_or_both, get_messages_and_products, get_subscribed_company, is_allowed_to_be_launched
from .models import Campaign, CampaignLead, CampaignOptions, CampaignStats, LeadList, Message, MessageAssignment, Schedule
import logging
from django.views.decorators.cache import cache_page

logger = logging.getLogger(__name__)




def leads_lists(request):
    lead_lists= get_lead_lists_or_both(request, lead_lists_only=True, list_id=None)

    context = {
        'lead_lists': lead_lists
    }

    return render(request, "app/leads/leads-lists.html", context)


def leads_view(request, pk):

    lead_lists, leads, = get_lead_lists_or_both(request, lead_lists_only=False, list_id=pk)
    lead_lists_assign= lead_lists.exclude(id=pk)

    context = {
        'leads': leads,
        'lead_list_id': pk,
        'lead_lists': lead_lists,
        'lead_lists_assign': lead_lists_assign
    }
    return render(request, "app/leads/leads-view.html", context)



def show_all_leads_view(request):

    lead_lists, leads, = get_lead_lists_or_both(request, lead_lists_only=False, list_id=None)

    context = {
        'leads': leads,
        'lead_lists': lead_lists,
    }
    return render(request, "app/leads/all-leads-view.html", context)



def add_leads(request, pk):
    return render(request, "app/leads/add-leads.html", context={'lead_list_id': pk})



def create_campaign_view(request): 
    products= get_company_products(request)

    context = {
        'products': products,
    }

    return render(request, "app/campaign/add-new.html", context)








def campaign_view_list(request):
    campaigns, products= get_campaigns_and_products(request)
    campaigns_stats= CampaignStats.objects.filter(campaign__in=campaigns)

    context = {
        'campaigns': campaigns,
        'products': products,
        'campaigns_stats': campaigns_stats
    }

    return render(request, "app/campaign/view-list.html", context)


def campaign_dashboard(request, pk):
    campaign_status= get_campaign_status(request, pk)
    campaign_stats = get_or_none(CampaignStats, campaign=pk)
    context = {
        'campaign_id': pk,
        'current_tab': 'analytics',
        'campaign_status': campaign_status,
        'stats': campaign_stats
    }
    return render(request, "app/campaign/dashboard.html", context)


@cache_page(60 * 15)
def campaign_msgs_performance(request, pk):
    campaign = get_object_or_404(Campaign, pk=pk)
    campaign_status= get_campaign_status(request, pk)
    all_messages_in_campaign = Message.objects.filter(
        messageassignment__campaign=campaign
    ).distinct()
    
    # Base queryset for all assignments in this campaign
    assignments_list = MessageAssignment.objects.filter(
        campaign_id=pk
    ).select_related(
        'campaign_lead__lead', 'message' # Optimization to prevent N+1 queries
    ).order_by('-sent_at') # Order by most recently sent

    
    # --- Filtering Logic (handle GET parameters) ---
    # This is a basic implementation. You can expand this for your API.
    # For a full HTMX/AJAX solution, this logic would move to a separate API view.
    # But for a standard Django page, this works.
    
    search_query = request.GET.get('search', '')
    status_filter = request.GET.get('status', '')
    message_filter = request.GET.get('message', '')
    
    if search_query:
        assignments_list = assignments_list.filter(
            Q(campaign_lead__lead__first_name__icontains=search_query) |
            Q(campaign_lead__lead__last_name__icontains=search_query) |
            Q(campaign_lead__lead__email__icontains=search_query)
        )
        
    if status_filter:
        if status_filter == 'sent':
            assignments_list = assignments_list.filter(sent=True)
        elif status_filter == 'opened':
            assignments_list = assignments_list.filter(opened=True)
        elif status_filter == 'clicked':
            assignments_list = assignments_list.filter(visit_count__gt=0)
        elif status_filter == 'responded':
            assignments_list = assignments_list.filter(responded=True)

    if message_filter:
        assignments_list = assignments_list.filter(message_id=message_filter)            

    # --- Pagination ---
    # This is the new part
    query_params = request.GET.copy()
    if 'page' in query_params:
        del query_params['page']

    # query_params.urlencode() will now contain "search=foo&status=bar" etc.
    # but not the "page=..." part.
        
    paginator = Paginator(assignments_list, 25)  # Show 25 assignments per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'campaign': campaign,
        'campaign_id': pk,
        'campaign_status': campaign_status,
        'current_tab': 'msgs_performance',
        'page_obj': page_obj, # Pass the paginated object, not the full list
        'query_params': query_params.urlencode(),
        
        # For filters
        'all_messages': all_messages_in_campaign,
        'search_query': search_query,
        'status_filter': status_filter,
        'message_filter': int(message_filter) if message_filter else None,
    }
    return render(request, "app/campaign/campaign-msgs-performance.html", context)



def campaign_leads(request, pk):
    is_view_only = is_campaign_view_only(pk)
    campaign_status= get_campaign_status(request, pk)
    
    all_lead_lists= get_lead_lists_or_both(request, lead_lists_only=True, list_id=None)
    lead_lists= all_lead_lists.filter(campaigns=pk)
    lead_lists_assign= all_lead_lists.exclude(campaigns__id=pk)

    context = {
        'campaign_id': pk,
        'current_tab': 'leads',
        'lead_lists': lead_lists,
        'lead_lists_assign': lead_lists_assign,
        'view_only': is_view_only,
        'campaign_status': campaign_status
    }
    return render(request, "app/campaign/campaign-leads.html", context)




def campaign_sequence(request, pk):
    campaign_status = get_campaign_status(request, pk)
    is_view_only = is_campaign_view_only(pk)

    all_messages, products = get_messages_and_products(request)

    messages = all_messages.filter(
        messageassignment__campaign_id=pk
    ).annotate(
        total_assignments=Count('messageassignment'),
        sent_count=Count('messageassignment', filter=Q(messageassignment__sent=True)),
        response_count=Count('messageassignment', filter=Q(messageassignment__responded=True)),
        delayed_by_days=Min('messageassignment__delayed_by_days')
    ).distinct().order_by('messageassignment__delayed_by_days', 'id')

    products = products.filter(product_campaigns=pk)
    all_messages = all_messages.filter(product__in=products)
    all_messages = all_messages.exclude(id__in=messages.values_list('id', flat=True))

    last_assignment_delay_value = 0 

    last_assignment_in_sequence = MessageAssignment.objects.filter(
        campaign_id=pk
    ).order_by('-delayed_by_days', '-id').first()

    if last_assignment_in_sequence:
        last_assignment_delay_value = last_assignment_in_sequence.delayed_by_days

    context = {
        'campaign_id': pk,
        'current_tab': 'sequences',
        'campaign_assigned_messages': messages,
        'all_messages': all_messages,
        'view_only': is_view_only,
        'campaign_status': campaign_status,
        'last_assigned_message_delay': last_assignment_delay_value,
    }
    return render(request, "app/campaign/sequence.html", context)




def campaign_scheduele(request, pk):
    campaign_status= get_campaign_status(request, pk)
    is_view_only = is_campaign_view_only(pk)

    
    timezones, days, times = timezone_options, days_options, time_options
    campaign = Campaign.objects.get(id=pk)
    campaign_Schedule = Schedule.objects.filter(campaign=campaign)
    
    context = {
        'campaign_id': pk,
        'current_tab': 'schedule',
        'timezones': timezones,
        'days': days,
        'times': times,
        'schedule': campaign_Schedule,
        'view_only': is_view_only,
        'campaign_status': campaign_status
    }
    return render(request, "app/campaign/scheduele.html", context)



def campaign_options(request, pk):
    campaign_status= get_campaign_status(request, pk)
    is_view_only = is_campaign_view_only(pk)
    allowed_to_launch = is_allowed_to_be_launched(request, pk)


    # Get all email accounts for the company
    company_email_accounts = get_company_email_accounts(request)
    
    # Get all campaigns for the company (excluding current campaign if needed)
    campaigns, products = get_campaigns_and_products(request)
    
    # Get all email accounts used in any campaign options
    used_email_ids = set()
    for campaign in campaigns:
        # Skip current campaign if you don't want to mark emails used in current campaign as "used"
        if campaign.id == pk:
            continue
            
        campaign_options = CampaignOptions.objects.filter(campaign=campaign).first()
        if campaign_options:
            used_email_ids.update(campaign_options.email_accounts.values_list('id', flat=True))
    
    # Get selected emails for current campaign
    current_campaign_options = CampaignOptions.objects.filter(campaign_id=pk).first()
    
    # Prepare the email list in required format
    formatted_emails = []
    for email_account in company_email_accounts:
        formatted_emails.append({
            'email_id': email_account.id,
            'email': email_account.email,
            'active': email_account.status == 'active',
            'used': email_account.id in used_email_ids,
        })
    
    context = {
        'campaign_id': pk,
        'current_tab': 'options',
        'emails': formatted_emails,
        'campaign_options': current_campaign_options,
        'view_only': is_view_only,
        'campaign_status': campaign_status,
        'allowed_to_launch': allowed_to_launch
    }
    return render(request, "app/campaign/options.html", context)




def products_view(request):
    """Products management page"""

    products = get_company_products(request)
    
    context = {
        'products': products
    }
    return render(request, "app/products/products.html", context)




def email_accounts_view(request):
    """Email accounts management page"""
    
    email_accounts= get_company_email_accounts(request)

    context = {
        'emails': email_accounts
    }
    return render(request, "app/account/email-accounts.html", context)




def messages_view(request):
    """Messages management page"""
    messages, products = get_messages_and_products(request)

    message_stats = []

    for message in messages:
        # Get all assignments for this message
        assignments = MessageAssignment.objects.filter(message=message)
        total_assignments = assignments.count()

        # Opened
        opened_count = assignments.filter(opened=True).count()
        open_rate = (opened_count / total_assignments * 100) if total_assignments > 0 else 0

        # Replied
        replied_count = assignments.filter(responded=True).count()
        responded_rate = (replied_count / total_assignments * 100) if total_assignments > 0 else 0

        # Clicks and CTR
        click_data = assignments.aggregate(total_clicks=Sum('visit_count'))
        total_clicks = click_data['total_clicks'] or 0
        ctr = (total_clicks / total_assignments * 100) if total_assignments > 0 else 0

        # Opportunities
        opportunities = CampaignLead.objects.filter(
            messageassignment__message=message,
            opportunity_status__in=["positive", "won"]
        ).distinct().count()

        # Performance metric (opened + replied + clicked) / 3
        performance = (((opened_count + replied_count + total_clicks)/3) / total_assignments * 100) if total_assignments > 0 else 0 

        # Attach stats to the message object
        message.opened_count = opened_count
        message.open_rate = round(open_rate, 2)
        message.responded_count = replied_count
        message.responded_rate = round(responded_rate, 2)
        message.clicks = total_clicks
        message.ctr = round(ctr, 2)
        message.performance = round(performance, 2)
        message.opportunity_count = opportunities

        message_stats.append({
            "message": message,
            "opened": opened_count,
            "clicked": total_clicks,
            "replied": replied_count,
            "opportunities": opportunities
        })

    # Compute the "most" metrics
    most_opened = max(message_stats, key=lambda x: x["opened"], default=None)
    most_clicked = max(message_stats, key=lambda x: x["clicked"], default=None)
    most_replied = max(message_stats, key=lambda x: x["replied"], default=None)
    most_opportunity = max(message_stats, key=lambda x: x["opportunities"], default=None)

    context = {
        'messages_query': messages,
        'products': products,
        'most_opened': most_opened["message"] if most_opened else None,
        'most_clicked': most_clicked["message"] if most_clicked else None,
        'most_replied': most_replied["message"] if most_replied else None,
        'most_opportunity': most_opportunity["message"] if most_opportunity else None,
    }

    return render(request, "app/msgs/messages.html", context)



def messages_edit_view(request, pk):
    """Messages management page"""

    messages, products = get_messages_and_products(request)

    context = {
        'messages_query': messages,
        'message_id': pk,
        'products': products
    }
    return render(request, "app/msgs/messages-edit.html", context)


def messages_add_view(request):
    """Messages management page"""

    messages, products = get_messages_and_products(request)

    context = {
        'messages_query': messages,
        'products': products
    }

    return render(request, "app/msgs/messages-edit.html", context)




def overall_dashboard_view(request):
    """Overall dashboard page"""
    return render(request, "app/overall-dashboard.html")


@login_required
def account_settings_view(request):
    """Account settings page with Google account linking functionality"""
    
    if request.method == 'POST':
        action = request.POST.get('action')
        
        if action == 'disconnect_google':
            # Disconnect Google account
            request.user.google_email = None
            request.user.google_login_enabled = False
            request.user.save()
            
            messages.success(request, 'Google account has been disconnected from your account.')
            return redirect('account_settings')
            
        elif action == 'disable_google_login':
            # Disable Google login but keep the linked email
            request.user.google_login_enabled = False
            request.user.save()
            
            messages.success(request, 'Google login has been disabled.')
            return redirect('account_settings')
            
        elif action == 'enable_google_login':
            # Enable Google login if email is linked
            if request.user.google_email:
                request.user.google_login_enabled = True
                request.user.save()
                messages.success(request, 'Google login has been enabled.')
            else:
                messages.error(request, 'No Google account is linked. Please connect your Google account first.')
            return redirect('account_settings')
    
    context = {
        'user': request.user,
        'google_email_linked': bool(request.user.google_email),
        'google_email': request.user.google_email,
        'google_login_enabled': request.user.google_login_enabled,
    }
    
    return render(request, "app/account/account-settings.html", context)


def tracking_test_view(request):
    """Simple view to test if tracking endpoints are accessible"""
    from django.conf import settings
    from .tracking import get_pytracking_configuration

    try:
        site_url = getattr(settings, 'SITE_URL', 'Not configured')
        config = get_pytracking_configuration()

        test_data = {
            'site_url': site_url,
            'open_tracking_url': config.base_open_tracking_url,
            'click_tracking_url': config.base_click_tracking_url,
            'status': 'OK',
            'message': 'Tracking configuration is working'
        }

        return JsonResponse(test_data)

    except Exception as e:
        return JsonResponse({
            'status': 'ERROR',
            'message': str(e)
        }, status=500)
