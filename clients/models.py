from datetime import timedelta
from django.conf import settings
from django.urls import reverse
from django.utils import timezone
from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from urllib.parse import urlparse, urlunparse
from django.core import validators
from django.utils.text import slugify
import uuid


class LoginToken(models.Model):
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    email = models.EmailField(blank=True, null=True)
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        if not self.id:
            self.expires_at = timezone.now() + timedelta(days=3)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Login token for user with {self.email}"
    
    def magic_login_link(self):
        relative_link = reverse('login_with_token', args=[self.token])
        base_url = getattr(settings, 'SITE_URL', None)

        if not base_url:
            print("WARNING: SITE_BASE_URL not set in settings. Defaulting to relative link.")
            return relative_link

        from urllib.parse import urljoin
        full_url = urljoin(base_url, relative_link)

        return full_url


class SignupToken(models.Model):
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    email = models.EmailField(blank=True, null=True)
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        if not self.id:
            self.expires_at = timezone.now() + timedelta(days=7)
        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.token)


class SubscribedCompany(models.Model):
    name = models.CharField(max_length=255)
    website = models.URLField(unique=True, blank=True)
    email= models.EmailField(unique=True, blank=True)
    industry = models.CharField(max_length=100, blank=True)
    employee_count = models.CharField(max_length=50, blank=True)
    linkedin_page= models.URLField(blank=True, null=True)
    location= models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.name}"



class Plan(models.Model):
    BILLING_CYCLE_CHOICES = [
        ('trial', 'Trial'),
        ('monthly', 'Monthly'),
        ('3-month', '3 Months'),
        ('6-month', '6 Months'),
        ('annual', 'Annual'),
    ]

    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    billing_cycle = models.CharField(max_length=20, choices=BILLING_CYCLE_CHOICES)
    duration_days = models.PositiveIntegerField(
        blank=True,
        help_text="Number of days this plan lasts (e.g., 30 for monthly, 365 for annual)."
    )

    def save(self, *args, **kwargs):
        # Automatically generate slug
        if not self.slug:
            self.slug = slugify(self.name)

        if not self.duration_days:
            # Set duration_days based on billing cycle
            if self.billing_cycle == 'monthly':
                self.duration_days = 30
            elif self.billing_cycle == '3-month':
                self.duration_days = 90
            elif self.billing_cycle == '6-month':
                self.duration_days = 180
            elif self.billing_cycle == 'annual':
                self.duration_days = 365
            else:
                self.duration_days = 30

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} (${self.price}/{self.billing_cycle})"




class Subscription(models.Model): 
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('trial', 'Trial'),
        ('past_due', 'Past Due'),
        ('canceled', 'Canceled'),
        ('trial_expired', 'Trial Expired'),
        ('expired', 'Expired'),
    ]
    
    subscribed_company = models.ForeignKey('SubscribedCompany', on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey('Plan', on_delete=models.PROTECT, related_name='subscriptions')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='trial')
    start_date = models.DateTimeField(auto_now_add=True)
    trial_end_date = models.DateTimeField(null=True, blank=True)
    current_period_end = models.DateTimeField(null=True, blank=True)
    canceled_at = models.DateTimeField(null=True, blank=True)
    
    # Billing information
    billing_email = models.EmailField()
    payment_method_id = models.CharField(max_length=255, blank=True)

    # Notification tracking
    days_to_expiry_warning_sent = models.IntegerField(null=True, blank=True, help_text="Tracks which day's warning email has been sent (e.g., 5, 4, 3, 2, 1). Null if none sent.")
    expiry_notification_sent = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        is_new_object = self._state.adding

        if is_new_object and self.start_date is None:
            self.start_date = timezone.now()
        # Update trial_end_date or current_period_end based on status
        if self.status == 'trial' and not self.trial_end_date:
            if self.plan_id:
                self.trial_end_date = self.start_date + timedelta(days=self.plan.duration_days)

        elif self.status == 'active' and not self.current_period_end:
            if self.plan_id:
                self.current_period_end = self.start_date + timedelta(days=self.plan.duration_days)

        elif self.status == 'canceled':
            self.canceled_at = timezone.now()

        elif self.status in ['trial_expired', 'expired']:
            self.current_period_end = None

        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.subscribed_company.name}-{self.plan.name}-{self.id}"






class BillingHistory(models.Model):
    subscribed_company = models.ForeignKey(SubscribedCompany, on_delete=models.CASCADE, related_name='billing_history')
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255)
    invoice_id = models.CharField(max_length=255, blank=True)
    payment_method = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=20, choices=[
        ('paid', 'Paid'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded')
    ])
    
    class Meta:
        verbose_name_plural = "Billing Histories"
    
    def __str__(self):
        return self.invoice_id


class CustomUser(AbstractUser):
    subscribed_company = models.ForeignKey(SubscribedCompany, on_delete=models.CASCADE, related_name='users')


    # New fields
    onboarding_completed = models.BooleanField(default=False)
    google_login_enabled = models.BooleanField(default=False, help_text="Allow this user to login with Google account")
    google_email = models.EmailField(blank=True, null=True, help_text="Google email linked to this account for OAuth login")

    position = models.CharField(max_length=100, blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    linkedin_profile = models.URLField(blank=True, null=True)
    
    # Fix group conflicts
    groups = models.ManyToManyField(
        Group,
        related_name='custom_user_set',
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups'
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='custom_user_set',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions'
    )





class Product(models.Model):
    subscribed_company = models.ForeignKey(SubscribedCompany, on_delete=models.CASCADE)

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    landing_page_url = models.URLField(blank=True)

    def clean(self):
        """Clean the model fields before validation"""
        super().clean()
        
        # Clean the landing page URL
        if self.landing_page_url:
            self.landing_page_url = self._normalize_url(self.landing_page_url)
    
    def _normalize_url(self, url):
        """Normalize URL to ensure consistent format"""
        if not url:
            return ""
            
        # Parse the URL into components
        parsed = urlparse(url)
        
        # Normalize path (ensure consistent trailing slash handling)
        path = parsed.path
        if not path:
            path = "/"
        elif path != "/" and not path.endswith("/"):
            # Add trailing slash for consistency
            path = path + "/"
            
        # Rebuild the URL with normalized path
        normalized = urlunparse((
            parsed.scheme,
            parsed.netloc,
            path,
            parsed.params,
            parsed.query,
            parsed.fragment  # Preserve fragment (#) if present
        ))
        
        return normalized
    
    def save(self, *args, **kwargs):
        # Clean the URL before saving
        if self.landing_page_url:
            self.landing_page_url = self._normalize_url(self.landing_page_url)
        
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name



class EmailAccount(models.Model):
    CONNECTION_TYPE_CHOICES = [
        ('gmail', 'Gmail (OAuth2)'),
        ('outlook', 'Outlook/Microsoft 365 (OAuth2)'),
        ('yahoo', 'Yahoo (OAuth2)'),
        ('imap/smtp', 'IMAP/SMTP'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('error', 'Error'),
        ('pending', 'Pending'),
    ]

    subscribed_company = models.ForeignKey(
        SubscribedCompany,
        on_delete=models.CASCADE,
        related_name='email_accounts'
    )

    email = models.EmailField(unique=True)
    connection_type = models.CharField(max_length=20, choices=CONNECTION_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)

    # For SMTP accounts only
    smtp_host = models.CharField(max_length=255, blank=True)
    smtp_port = models.IntegerField(default=587)
    smtp_use_tls = models.BooleanField(default=True)
    smtp_use_ssl = models.BooleanField(default=False) 

    smtp_username = models.CharField(max_length=255, blank=True)
    smtp_password = models.CharField(max_length=255, blank=True)

    # Optional sender profile settings
    sender_name = models.CharField(max_length=255, blank=True)
    sender_signature = models.TextField(blank=True)
    default_from_email = models.CharField(max_length=255, blank=True)

    # For Gmail/Outlook/Yahoo OAuth2
    access_token = models.TextField(blank=True)
    refresh_token = models.TextField(blank=True)
    token_expiry = models.DateTimeField(null=True, blank=True)
    last_auth_url = models.URLField(blank=True, null=True)

    # Rate control
    min_wait_time = models.IntegerField(default=1)
    emails_sent = models.IntegerField(default=0)

    daily_limit = models.IntegerField(validators=[
            validators.MinValueValidator(1, "Daily limit must be at least 1."),
            validators.MaxValueValidator(1000, "Daily limit cannot exceed 1000.")
        ],
        default=30)

    def __str__(self):
        return f"{self.email} - {self.get_connection_type_display()}"

    def requires_oauth(self):
        return self.connection_type in ['gmail', 'outlook', 'yahoo']

    def is_smtp(self):
        return self.connection_type == 'imap/smtp'
    
    def test_connection(self):
        """
        Test the connection for this email account

        Returns:
            dict: {'success': bool, 'message': str}
        """
        from campaign.email_sender import test_email_account_connection
        return test_email_account_connection(self)