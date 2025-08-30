from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import Plan, Subscription, BillingHistory, CustomUser, SubscribedCompany, Product, EmailAccount, SignupToken
from django.utils.html import format_html


@admin.register(SignupToken)
class SignupTokenAdmin(admin.ModelAdmin):
    list_display = ('token', 'email', 'is_used', 'created_at', 'expires_at')
    readonly_fields = ('token', 'created_at', 'expires_at')


class CustomUserCreationForm(UserCreationForm):
    """Custom form for creating users with additional fields"""
    class Meta(UserCreationForm.Meta):
        model = CustomUser
        fields = UserCreationForm.Meta.fields + ('email', 'first_name', 'last_name', 'subscribed_company')


class CustomUserChangeForm(UserChangeForm):
    """Custom form for changing users with additional fields"""
    class Meta(UserChangeForm.Meta):
        model = CustomUser
        fields = UserChangeForm.Meta.fields


@admin.register(SubscribedCompany)
class SubscribedCompanyAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'website', 'employee_count', 'location')
    search_fields = ('name', 'website')
    list_filter = ('employee_count', 'location',)



@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'price', 'billing_cycle')



@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    # Use custom forms
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser

    # Display fields in the list view
    list_display = ('id', 'username', 'email', 'first_name', 'last_name', 'subscribed_company', 'is_staff', 'is_active', 'onboarding_completed')
    search_fields = ('email', 'username', 'first_name', 'last_name', 'subscribed_company')
    list_filter = ('subscribed_company', 'is_staff', 'is_active', 'is_superuser', 'onboarding_completed')

    # Fields to display when editing an existing user
    fieldsets = UserAdmin.fieldsets + (
        ('Company Information', {'fields': ('subscribed_company', 'onboarding_completed')}),
        ('Personal Information 2', {'fields': ('phone_number', 'linkedin_profile')}),
    )

    # Fields to display when adding a new user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2'),
        }),
        ('Personal Information', {
            'fields': ('email', 'first_name', 'last_name'),
        }),
        ('Personal Information 2', {
            'fields': ('phone_number', 'linkedin_profile'),
        }),
        ('Company Information', {
            'fields': ('subscribed_company', 'position', 'onboarding_completed'),
        }),
    )
    


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'subscribed_company', 'plan', 'status', 'start_date', 'trial_end_date',
        'current_period_end', 'billing_email', 'days_to_expiry_warning_sent',
        'expiry_notification_sent'
    )
    list_filter = (
        'subscribed_company', 'plan', 'status', 'start_date', 'trial_end_date',
        'current_period_end', 'expiry_notification_sent'
    )
    search_fields = (
        'subscribed_company__name', 'plan__name', 'billing_email',
        'payment_method_id'
    )


@admin.register(BillingHistory)
class BillingHistoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'subscribed_company', 'subscription', 'amount', 'description', 'invoice_id', 'payment_method', 'status')
    search_fields = ('id', 'subscribed_company__name', 'name', 'description', 'subscribed_company__name')
    list_filter = ('subscribed_company', 'status') 

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'subscribed_company', 'name', 'campaign_count', 'landing_page_link') 
    search_fields = ('subscribed_company__name', 'name', 'description', 'subscribed_company__name')
    list_filter = ('subscribed_company',) 
    
    def campaign_count(self, obj):
        return obj.product_campaigns.count()
    campaign_count.short_description = 'Campaigns'
    
    def landing_page_link(self, obj):
        if obj.landing_page_url:
            return format_html('<a href="{}" target="_blank">View Landing Page</a>', obj.landing_page_url)
        return "-"
    landing_page_link.short_description = 'Landing Page'



@admin.register(EmailAccount)
class EmailAccountAdmin(admin.ModelAdmin):
    list_display = ('id', 'subscribed_company', 'email', 'connection_type', 'status', 'emails_sent', 'daily_limit')
    search_fields = ('email', 'subscribed_company__name', )
    list_filter = ('subscribed_company', 'connection_type', 'status',)