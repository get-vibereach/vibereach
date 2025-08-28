from django.db import models
from django.utils import timezone
import uuid
from urllib.parse import urlparse, urlunparse, parse_qs, urlencode
from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from django.conf import settings
import re
from clients.models import EmailAccount, SubscribedCompany, Product
import markdown
from .dicts import timezone_options, days_options, time_options, get_default_days
from django.contrib.postgres.fields import ArrayField
from django.core import validators
from django.db.models import Q, Count, Sum
from django.utils import timezone



class Campaign(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('draft', 'Draft'),
        ('ended', 'Ended'),
        ('completed', 'Completed')
    ]
    subscribed_company = models.ForeignKey(SubscribedCompany, on_delete=models.CASCADE)

    name = models.CharField(max_length=255)
    short_name = models.SlugField(unique=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_campaigns')
    start_date = models.DateTimeField(blank=True, null=True)
    end_date = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    status= models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')

    def save(self, *args, **kwargs):
        # Generate short_name if not provided
        if not self.short_name:
            # First save to get an ID if this is a new campaign
            if not self.id:
                super().save(*args, **kwargs)
                
            # Get first letter of each word in campaign name
            name_initials = ''.join([word[0].lower() for word in self.name.split() if word])
            
            # Create short_name with campaign ID and initials
            self.short_name = f"c{self.id}-{name_initials}"
            
            # Save again with the generated short_name
            kwargs['force_insert'] = False
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name}"

    def to_dict_for_ai(self):
        """Return a dictionary with campaign data formatted for AI personalization"""
        return {
            'name': self.name,
            'short_name': self.short_name,
            'product_name': self.product.name,
            'product_description': self.product.description,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None
        }

    def is_locked_for_editing(self):
        """
        Check if campaign is locked for editing.
        Returns True if campaign is active or completed and should not be edited.
        """
        return self.status in ['active', 'completed']


class Schedule(models.Model):
    subscribed_company = models.ForeignKey(SubscribedCompany, on_delete=models.CASCADE, null=True, blank=True)
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, null=True, blank=True)

    TIME_ZONES = timezone_options
    DAYES_CHOICES = days_options
    TIME_CHOICES= time_options

    name = models.CharField(max_length=255, default="Default Schedule")
    start_date = models.DateTimeField(default=timezone.now)
    timing_from = models.CharField(max_length=255, choices=TIME_CHOICES, default="00:00", blank=True)
    timing_to = models.CharField(max_length=255, choices=TIME_CHOICES, default="23:00", blank=True)
    time_zone = models.CharField(max_length=255, choices=TIME_ZONES, default="Europe/London", blank=True)
    days = ArrayField(
        models.CharField(max_length=3, choices=days_options),
        blank=True,
        default=get_default_days,
    )

    def __str__(self):
        return self.name





class CampaignOptions(models.Model):
    """
    Model to store various options and settings for a marketing campaign,
    as derived from the VibeReach UI screenshot.
    """

    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='campaign_options')
    
    # Accounts to use
    email_accounts = models.ManyToManyField(EmailAccount, related_name='email_accounts_campaign_options', blank=True)
    
    # Stop sending emails on reply
    stop_on_reply = models.BooleanField(default=True)
    
    # Open Tracking
    open_tracking_enabled = models.BooleanField(default=False)
    link_tracking_enabled = models.BooleanField(default=True)
    
    # Delivery Optimization
    send_as_text_only = models.BooleanField(default=False)
    send_first_email_as_text_only = models.BooleanField(default=False)
    
    #Daily Limit
    daily_limit = models.IntegerField(
        validators=[
            validators.MinValueValidator(1, "Daily limit must be at least 1."),
            validators.MaxValueValidator(1000, "Daily limit cannot exceed 1000.")
        ],
        default=30
    )
    
    def __str__(self):
        return f"Options for Campaign: {self.campaign.name}"
     
    class Meta:
        verbose_name = "Campaign Option"
        verbose_name_plural = "Campaign Options" 
   




class LeadList(models.Model):
    subscribed_company = models.ForeignKey(SubscribedCompany, on_delete=models.CASCADE, null=True, blank=True)
    title= models.CharField(max_length=255)
    tags= models.CharField(max_length=255, default='new list', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    campaigns= models.ManyToManyField(Campaign, null=True, blank=True)

    def __str__(self):
        return f"{self.title}"



class Lead(models.Model):
    lead_list = models.ForeignKey(LeadList, on_delete=models.CASCADE, null=True, blank=True, related_name="lead_lists")
    subscribed_company = models.ForeignKey(SubscribedCompany, on_delete=models.CASCADE, null=True, blank=True)

    full_name = models.CharField(max_length=255)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)

    full_arabic_name = models.CharField(max_length=255, blank=True)
    first_arabic_name = models.CharField(max_length=100, blank=True)
    last_arabic_name = models.CharField(max_length=100, blank=True)
    
    position = models.CharField(max_length=100, blank=True)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20, blank=True)
    linkedin_profile = models.URLField(blank=True)
    
    company_name = models.CharField(max_length=255)
    company_arabic_name = models.CharField(max_length=255, blank=True)
    company_website = models.URLField(blank=True)
    industry = models.CharField(max_length=100, blank=True)
    employee_count = models.CharField(max_length=50, blank=True)
    campany_linkedin_page= models.URLField(blank=True)

    location= models.CharField(max_length=255, blank=True)

    SOURCE_CHOICES = [
        ("linkedin_scrape", "LinkedIn Scrape"),
        ("social", "Social Media"),
        ("newsletter", "Newsletter Opt-in"),
        ("form", "Form"),
        ("other", "Other"),
    ]
    TYPE_CHOICES = [
        ("cold", "Cold"),
        ("warm", "Warm"),
        ("hot", "Hot"),
        ("customer", "Customer"),
        ("other", "Other"),
    ]
    source = models.CharField(max_length=50, choices=SOURCE_CHOICES)
    lead_type = models.CharField(max_length=20, choices=TYPE_CHOICES)

    created_at = models.DateTimeField(auto_now_add=True)
    tags = models.CharField(max_length=255, blank=True, null=True)


    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["subscribed_company", "email"], name="unique_email_per_company"
            )
        ]

    def save(self, *args, **kwargs):
        # Auto-populate English first_name and last_name
        if self.full_name and (not self.first_name or not self.last_name):
            name_parts = self.full_name.strip().split()
            if len(name_parts) > 0:
                self.first_name = name_parts[0]
                if len(name_parts) > 1:
                    self.last_name = ' '.join(name_parts[1:])
        
        # Auto-populate Arabic first_arabic_name and last_arabic_name
        if self.full_arabic_name and (not self.first_arabic_name or not self.last_arabic_name):
            arabic_parts = self.full_arabic_name.strip().split()
            if len(arabic_parts) > 0:
                self.first_arabic_name = arabic_parts[0]
                if len(arabic_parts) > 1:
                    self.last_arabic_name = ' '.join(arabic_parts[1:])

        super().save(*args, **kwargs)


    def __str__(self):
        return f"{self.full_name}"

    def to_dict_for_ai(self):
        """Return a dictionary with lead data formatted for AI personalization"""
        return {
            'full_name': self.full_name,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_arabic_name': self.full_arabic_name,
            'first_arabic_name': self.first_arabic_name,
            'last_arabic_name': self.last_arabic_name,
            'position': self.position,
            'company_name': self.company_name,
            'company_arabic_name': self.company_arabic_name,
            'company_website': self.company_website,
            'industry': self.industry,
            'location': self.location,
            'source': self.get_source_display(),
            'lead_type': self.get_lead_type_display(),
            'created_at': self.created_at.isoformat()
        }
    
    @classmethod
    def get_field_names(cls, exclude=None):
        """
        Return model field names, excluding relations and system fields.
        Optionally pass a list of fields to exclude.
        """
        exclude = [
            "id",
            "lead_list",
            "subscribed_company",
            "email",
            "phone_number",
            "linkedin_profile",
            "employee_count",
            "campany_linkedin_page",
            "source",
            "lead_type",
            "tags",
            "created_at",            
        ]

        return [
            field.name
            for field in cls._meta.get_fields()
            if field.concrete and not field.is_relation and field.name not in exclude
        ]





class CampaignLead(models.Model):
    OPPORTUNITY_STATUS_CHOICES = [
        ('none', 'No Opportunity'),
        ('positive', 'Positive'),
        ('won', 'Won'),
        ('lost', 'Lost'),
    ]

    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE)
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE)

    # Legacy conversion field (keep for backward compatibility)
    is_converted = models.BooleanField(default=False)
    converted_at = models.DateTimeField(null=True, blank=True)

    # Enhanced opportunity tracking
    opportunity_status = models.CharField(
        max_length=20,
        choices=OPPORTUNITY_STATUS_CHOICES,
        default='none',
        help_text="Current opportunity status for this lead"
    )

    opportunity_marked_at = models.DateTimeField(null=True, blank=True)

    # Conversion tracking (when opportunity becomes won)
    conversion_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Actual conversion value (can be different from opportunity_value)"
    )
    conversion_notes = models.TextField(blank=True, help_text="Notes about the conversion")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('campaign', 'lead')

    def __str__(self):
        return f"{self.lead} - {self.campaign.name}"

    def convert(self):
        """Mark this lead as converted (legacy method)"""
        if not self.is_converted:
            self.is_converted = True
            self.converted_at = timezone.now()
            self.save()

            # Update campaign stats
            stats, _ = CampaignStats.objects.get_or_create(campaign=self.campaign)
            stats.update_from_campaign()

            return True
        return False

    def mark_as_opportunity(self, value=None):
        """Mark this lead as a positive opportunity"""
        self.opportunity_status = 'positive'
        self.opportunity_value = value
        self.opportunity_marked_at = timezone.now()
        self.save()

        # 🔥 Update analytics efficiently
        from .services import AnalyticsService
        AnalyticsService.handle_opportunity_marked(self)

    def mark_as_won(self, conversion_value=None, notes=""):
        """Mark this opportunity as won (converted)"""
        self.opportunity_status = 'won'
        self.conversion_value = conversion_value or self.opportunity_value
        self.conversion_notes = notes

        # Also update legacy fields for backward compatibility
        self.is_converted = True
        self.converted_at = timezone.now()

        self.save()

        # 🔥 Update analytics efficiently
        from .services import AnalyticsService
        AnalyticsService.handle_conversion_marked(self)

    def mark_as_lost(self, notes=""):
        """Mark this opportunity as lost"""
        self.opportunity_status = 'lost'
        self.conversion_notes = notes
        self.save()

        # Update campaign stats
        stats, _ = CampaignStats.objects.get_or_create(campaign=self.campaign)
        stats.update_from_campaign()

    @property
    def is_opportunity(self):
        """Check if this lead is marked as a positive opportunity"""
        return self.opportunity_status == 'positive'

    @property
    def is_won(self):
        """Check if this lead has been converted (won)"""
        return self.opportunity_status == 'won'








class Message(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    subject = models.CharField(max_length=255)
    intro = models.TextField(blank=True)
    content = models.TextField()
    cta = models.CharField(max_length=255, blank=True)
    ps = models.TextField(blank=True)
    pps = models.TextField(blank=True)
    end = models.TextField(blank=True)

    full_content = models.TextField(blank=True)

    def __str__(self):
        return f"{self.subject}"
    
    

    def _convert_markdown_to_html(self, text):
        """
        Converts markdown text into clean HTML suitable for email.
        Each line becomes its own <p dir="auto"> block.
        """
        paragraphs = []
        for line in text.splitlines():
            line = line.strip()
            if line: 
                markdown_processed_content = markdown.markdown(line)
                adjusted_inner_html = markdown_processed_content.replace('<p>', '<p dir=\"auto\">')
                final_paragraph_block = "<p dir='auto'>{}</p>".format(adjusted_inner_html)
                paragraphs.append(final_paragraph_block)

        return "\n".join(paragraphs)



    def save(self, *args, **kwargs):
        # Collect all but the signature
        parts = []
        if self.intro:
            parts.append(self.intro)
        if self.content:
            parts.append(self.content)
        if self.cta:
            parts.append(self.cta)  
        if self.ps:
            parts.append(self.ps)
        if self.pps:
            parts.append(self.pps)

        # Combine with double newlines for spacing
        combined_content = "\n\n".join(parts)

        # Apply markdown conversion (with double <br>)
        combined_content = self._convert_markdown_to_html(combined_content)

        # Handle signature (end) separately: single break before it
        if self.end:
            end_html = markdown.markdown(
                self.end,
                extensions=["nl2br", "sane_lists"] 
            )
            end_html = end_html.replace("<p>", '<p dir="auto" class="signature">')
            combined_content += f"{end_html}"

        self.full_content = combined_content
        super().save(*args, **kwargs)
      




class MessageAssignment(models.Model):
    # Add campaign field for direct access and easier filtering
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, null=True, blank=True)
    
    campaign_lead = models.ForeignKey(CampaignLead, on_delete=models.CASCADE)
    message = models.ForeignKey(Message, on_delete=models.CASCADE)
    
    # --- DELETED FIELDS ---
    # The ForeignKey fields `url` and `newsletter_link` have been removed as they are no longer needed.
    
    personlized_msg_tmp = models.TextField(blank=True, help_text="Template content before AI personalization.")
    personlized_msg_to_send = models.TextField(blank=True, help_text="Final content after AI personalization, ready to be sent.")
    
    delayed_by_days = models.IntegerField(null=True, blank=True)

    # Status tracking
    sent = models.BooleanField(default=False)
    sent_at = models.DateTimeField(null=True, blank=True)

    opened = models.BooleanField(default=False)
    opened_at = models.DateTimeField(null=True, blank=True)
    
    responded = models.BooleanField(default=False)
    responded_at= models.DateTimeField(null=True, blank=True)
    responded_content = models.TextField(blank=True)

    # Simple link tracking (independent of the old Link model)
    link = models.CharField(max_length=255, blank=True, help_text="A raw tracking link URL to be included in the message.")
    visited_at = models.DateTimeField(null=True, blank=True)
    visit_count = models.IntegerField(default=0)

    def __str__(self):
        # Gracefully handle cases where related objects might not be loaded yet
        if not hasattr(self, 'campaign_lead') or self.campaign_lead is None:
            return f"New message assignment - {self.message.subject if hasattr(self, 'message') else 'No message'}"
        return f"{self.campaign_lead} - {self.message.subject}"

    def save(self, *args, **kwargs):
        """
        Custom save method to set default values before saving.
        """
        # Set campaign from campaign_lead if not explicitly set
        if self.campaign_lead and not self.campaign:
            self.campaign = self.campaign_lead.campaign
        
        # Populate the temporary personalized message from the base message if it's empty.
        # This now serves as the starting point for AI personalization.
        if not self.personlized_msg_tmp:
            self.personlized_msg_tmp = self.get_personalized_content_tmp() 
        
        super().save(*args, **kwargs)

    def get_personalized_content_tmp(self):
        """
        Get the base message content.
        This used to contain logic for replacing URL placeholders, which has been removed.
        If you need to re-implement link replacement, you can add it here using the `self.link` field.
        """
        return self.personlized_msg_tmp or self.message.full_content

    def track_visit(self):
        """Records a visit to the link associated with this message."""
        self.visit_count = models.F('visit_count') + 1 # Use F() expression to avoid race conditions
        self.visited_at = timezone.now()
        self.save(update_fields=['visit_count', 'visited_at'])
        self.refresh_from_db(fields=['visit_count'])

    def get_ai_personalization_data(self):
        """
        Gathers all relevant data needed for AI personalization.
        Returns a dictionary with lead, campaign, and message data.
        """
        data = {
            'lead': {},
            'campaign': {},
            'message': {
                'template': self.personlized_msg_tmp
            }
        }
        
        if self.campaign_lead and self.campaign_lead.lead:
            data['lead'] = self.campaign_lead.lead.to_dict_for_ai()
        
        if self.campaign:
            data['campaign'] = self.campaign.to_dict_for_ai()
        
        return data

    def personalize_with_ai(self, skip=True):
        """
        Uses an AI service to personalize this message and saves the result.
        Returns True if successful, False otherwise.
        """
        try:
            import logging
            logger = logging.getLogger(__name__)
            logger.info(f"📝 Starting personalization for message assignment {self.id}")

            from campaign.ai_service import personalize_message

            logger.info(f"🔄 Calling AI service for personalization (skip={skip})")
            personalized_text = personalize_message(self, skip=skip)

            if personalized_text:
                self.personlized_msg_to_send = personalized_text
                self.save(update_fields=['personlized_msg_to_send'])
                logger.info(f"✅ Successfully personalized message assignment {self.id}")
                return True
            else:
                logger.error(f"❌ AI service returned empty personalized text for assignment {self.id}")
                return False

        except Exception as e:
            import logging
            import traceback
            logger = logging.getLogger(__name__)
            logger.error(f"💥 Error personalizing message assignment {self.id}: {e}\n{traceback.format_exc()}")
            return False

    def mark_as_replied(self, reply_content=None):
        """
        Marks this message assignment as replied to and updates related objects.
        Returns True if the status was changed, False otherwise.
        """
        if self.responded:
            return False # Already marked as replied

        self.responded = True
        self.responded_at = timezone.now()
        if reply_content:
            self.responded_content = reply_content
        self.save(update_fields=['responded', 'responded_at', 'responded_content'])

        # Mark campaign lead as an opportunity
        if self.campaign_lead.opportunity_status == 'none':
            self.campaign_lead.mark_as_opportunity()

        # Trigger analytics or other services
        from .services import AnalyticsService
        AnalyticsService.handle_email_replied(self)

        return True

    def should_skip_sending_due_to_reply(self):
        """
        Checks if this message should be skipped because the lead has already
        replied in this campaign and the 'stop on reply' setting is active.
        """
        try:
            campaign_options = self.campaign.campaign_options.first()
            if not campaign_options or not campaign_options.stop_on_reply:
                return False

            # Check if any previous message in this campaign for this lead has been responded to
            return MessageAssignment.objects.filter(
                campaign=self.campaign,
                campaign_lead=self.campaign_lead,
                responded=True
            ).exists()

        except Exception:
            # Failsafe: if something goes wrong, don't skip sending.
            return False


class CampaignStats(models.Model):
    campaign = models.OneToOneField(Campaign, on_delete=models.CASCADE, related_name='campaign_stats')

    # Basic counts
    total_leads = models.IntegerField(default=0)
    sequence_started_count = models.IntegerField(default=0)
    opened_count = models.IntegerField(default=0)
    clicked_count = models.IntegerField(default=0) # Logic will be updated
    replied_count = models.IntegerField(default=0)
    opportunities_count = models.IntegerField(default=0)
    opportunity_value = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    conversions_count = models.IntegerField(default=0)
    conversion_total_value = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    # --- REMOVED FIELD ---
    # The 'best_cta' field is removed as it depended on the Link model.
    # best_cta = models.ForeignKey(Link, null=True, blank=True, on_delete=models.SET_NULL, related_name='+')
    
    best_message = models.ForeignKey(Message, null=True, blank=True, on_delete=models.SET_NULL, related_name='+')
    updated_at = models.DateTimeField(auto_now=True)

    # All @property methods remain unchanged as they depend on the fields above, not the logic to populate them.
    @property
    def sequence_started_rate(self):
        """Percentage of leads that started the sequence (received at least one email)"""
        return round(self.sequence_started_count / self.total_leads * 100, 2) if self.total_leads else 0

    @property
    def open_rate_percentage(self):
        """Percentage of leads that opened at least one email"""
        return round(self.opened_count / self.total_leads * 100, 2) if self.total_leads else 0

    @property
    def click_rate_percentage(self):
        """Percentage of leads that clicked at least one link"""
        return round(self.clicked_count / self.total_leads * 100, 2) if self.total_leads else 0

    @property
    def reply_rate_percentage(self):
        """Percentage of leads that replied to at least one message"""
        return round(self.replied_count / self.total_leads * 100, 2) if self.total_leads else 0

    @property
    def opportunities_total(self):
        """Percentage of leads marked as opportunities"""
        return round(self.opportunities_count * self.opportunity_value, 2) if self.total_leads else 0

    @property
    def conversion_total(self):
        """Percentage of leads that converted (won)"""
        return round(self.conversion_total_value, 2) if self.conversions_count else 0

    def update_from_campaign(self):
        """Update stats based on campaign data using MessageAssignment tracking."""
        campaign_leads = self.campaign.campaignlead_set.all()
        self.total_leads = campaign_leads.count()

        # 1. Sequence Started: leads that have been sent at least one email
        self.sequence_started_count = campaign_leads.filter(
            messageassignment__sent_at__isnull=False
        ).distinct().count()

        # 2. Open Rate: leads that opened at least one email
        self.opened_count = campaign_leads.filter(
            messageassignment__opened=True
        ).distinct().count()

        # 3. Click Rate (FIXED): leads that clicked at least one link
        self.clicked_count = campaign_leads.filter(
            messageassignment__visit_count__gt=0
        ).distinct().count()

        # 4. Reply Rate: leads that replied to at least one message
        self.replied_count = campaign_leads.filter(
            messageassignment__responded=True
        ).distinct().count()

        # 5. Opportunities: leads marked as positive opportunities (UNCHANGED)
        opportunities = campaign_leads.filter(opportunity_status='positive')
        self.opportunities_count = opportunities.count()
        # This seems to be a slight logic error in the original code, but preserving it as requested
        self.opportunities_total_value = self.opportunities_count * self.opportunity_value

        # 6. Conversions: leads that won (converted) (UNCHANGED)
        conversions = campaign_leads.filter(opportunity_status='won')
        self.conversions_count = conversions.count()
        self.conversion_total_value = sum(
            lead.conversion_value or 0 for lead in conversions
        )

        # Find best performing message (FIXED & OPTIMIZED)
        best_performing_message_data = MessageAssignment.objects.filter(
            campaign=self.campaign,
            visit_count__gt=0
        ).values('message_id').annotate(
            total_clicks=Sum('visit_count')
        ).order_by('-total_clicks').first()

        if best_performing_message_data:
            try:
                self.best_message = Message.objects.get(id=best_performing_message_data['message_id'])
            except Message.DoesNotExist:
                self.best_message = None
        else:
            self.best_message = None

        self.save()

    def __str__(self):
        return f"Stats for {self.campaign.name}"



class CampaignDailyStats(models.Model):
    """
    Daily snapshot of campaign metrics for time-series analytics.
    This model stores daily aggregated data for dashboard charts.
    """
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='daily_stats')
    date = models.DateField(help_text="Date for this metrics snapshot")

    # Daily counts (new events that day)
    emails_sent_today = models.IntegerField(default=0, help_text="Emails sent on this date")
    opens_today = models.IntegerField(default=0, help_text="New opens on this date")
    clicks_today = models.IntegerField(default=0, help_text="New clicks on this date") # Logic will be updated
    replies_today = models.IntegerField(default=0, help_text="New replies on this date")
    opportunities_today = models.IntegerField(default=0, help_text="New opportunities marked on this date")
    conversions_today = models.IntegerField(default=0, help_text="New conversions on this date")

    # Cumulative counts (total up to this date)
    total_emails_sent = models.IntegerField(default=0)
    total_opens = models.IntegerField(default=0)
    total_clicks = models.IntegerField(default=0) # Logic will be updated
    total_replies = models.IntegerField(default=0)
    total_opportunities = models.IntegerField(default=0)
    total_conversions = models.IntegerField(default=0)

    # Value tracking
    opportunities_value_today = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    conversions_value_today = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_opportunities_value = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_conversions_value = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('campaign', 'date')
        ordering = ['-date']
        indexes = [
            models.Index(fields=['campaign', 'date']),
            models.Index(fields=['date']),
        ]

    def __str__(self):
        return f"{self.campaign.name} - {self.date}"

    @classmethod
    def calculate_daily_stats(cls, campaign, target_date=None):
        """
        Calculate and save daily stats for a campaign on a specific date.
        """
        if target_date is None:
            target_date = timezone.now().date()

        daily_stats, created = cls.objects.get_or_create(
            campaign=campaign,
            date=target_date,
            defaults={}
        )

        start_of_day = timezone.make_aware(timezone.datetime.combine(target_date, timezone.datetime.min.time()))
        end_of_day = timezone.make_aware(timezone.datetime.combine(target_date, timezone.datetime.max.time()))

        # Daily counts (new events on this date)
        daily_stats.emails_sent_today = MessageAssignment.objects.filter(
            campaign=campaign, sent_at__range=(start_of_day, end_of_day)
        ).count()

        daily_stats.opens_today = MessageAssignment.objects.filter(
            campaign=campaign, opened_at__range=(start_of_day, end_of_day)
        ).count()

        # clicks_today (FIXED)
        daily_stats.clicks_today = MessageAssignment.objects.filter(
            campaign=campaign, visited_at__range=(start_of_day, end_of_day)
        ).count()

        daily_stats.replies_today = MessageAssignment.objects.filter(
            campaign=campaign, responded_at__range=(start_of_day, end_of_day)
        ).count()

        daily_stats.opportunities_today = CampaignLead.objects.filter(
            campaign=campaign, opportunity_marked_at__range=(start_of_day, end_of_day)
        ).count()

        daily_stats.conversions_today = CampaignLead.objects.filter(
            campaign=campaign, converted_at__range=(start_of_day, end_of_day)
        ).count()

        # Calculate cumulative totals (up to this date)
        daily_stats.total_emails_sent = MessageAssignment.objects.filter(
            campaign=campaign, sent_at__lte=end_of_day
        ).count()

        daily_stats.total_opens = MessageAssignment.objects.filter(
            campaign=campaign, opened_at__lte=end_of_day
        ).count()

        # total_clicks (FIXED)
        daily_stats.total_clicks = MessageAssignment.objects.filter(
            campaign=campaign, visited_at__lte=end_of_day
        ).count()

        daily_stats.total_replies = MessageAssignment.objects.filter(
            campaign=campaign, responded_at__lte=end_of_day
        ).count()

        daily_stats.total_opportunities = CampaignLead.objects.filter(
            campaign=campaign, opportunity_marked_at__lte=end_of_day
        ).count()

        daily_stats.total_conversions = CampaignLead.objects.filter(
            campaign=campaign, converted_at__lte=end_of_day
        ).count()

        # (UNCHANGED) Calculate value totals
        campaign_stats = campaign.campaign_stats
        opportunities_today = CampaignLead.objects.filter(
            campaign=campaign,
            opportunity_status='positive',
            opportunity_marked_at__range=(start_of_day, end_of_day)
        )
        daily_stats.opportunities_value_today = opportunities_today.count() * campaign_stats.opportunity_value

        conversions_today = CampaignLead.objects.filter(
            campaign=campaign,
            converted_at__range=(start_of_day, end_of_day)
        )
        daily_stats.conversions_value_today = sum(
            lead.conversion_value or 0 for lead in conversions_today
        )

        all_opportunities = CampaignLead.objects.filter(
            campaign=campaign,
            opportunity_status='positive',
            opportunity_marked_at__lte=end_of_day
        )
        daily_stats.total_opportunities_value = all_opportunities.count() * campaign_stats.opportunity_value

        all_conversions = CampaignLead.objects.filter(
            campaign=campaign,
            converted_at__lte=end_of_day
        )
        daily_stats.total_conversions_value = sum(
            lead.conversion_value or 0 for lead in all_conversions
        )

        daily_stats.save()
        return daily_stats




# Signal handlers for email rate limit synchronization
@receiver(post_save, sender=CampaignOptions)
def sync_email_account_rate_limits(sender, instance, created, **kwargs):
    """
    Sync EmailAccount daily_limit when CampaignOptions daily_limit changes.
    Distributes the campaign rate limit across selected email accounts.
    """
    if instance.email_accounts.exists():
        email_accounts = instance.email_accounts.all()
        email_count = email_accounts.count()

        if email_count > 0:
            # Calculate per-account limit: campaign_limit / number_of_accounts
            per_account_limit = instance.daily_limit // email_count

            # Ensure minimum of 1 per account
            if per_account_limit < 1:
                per_account_limit = 1

            # Update all email accounts
            for email_account in email_accounts:
                if email_account.daily_limit != per_account_limit:
                    email_account.daily_limit = per_account_limit
                    email_account.save(update_fields=['daily_limit'])


@receiver(m2m_changed, sender=CampaignOptions.email_accounts.through)
def sync_email_accounts_on_m2m_change(sender, instance, action, pk_set, **kwargs):
    """
    Sync email account rate limits when email accounts are added/removed from campaign options.
    """
    if action in ['post_add', 'post_remove', 'post_clear']:
        # Re-sync rate limits after the M2M change
        sync_email_account_rate_limits(CampaignOptions, instance, False)


