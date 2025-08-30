from clients.models import Subscription
from django.utils import timezone

def subscription_status(request):
    if request.user.is_authenticated and hasattr(request.user, 'subscribed_company') and request.user.subscribed_company:
        subscription = Subscription.objects.filter(subscribed_company=request.user.subscribed_company).first()
        if subscription:
            is_view_only = subscription.status in ['expired', 'canceled', 'trial_expired']
            
            end_date = None
            if subscription.status == 'trial' and subscription.trial_end_date:
                end_date = subscription.trial_end_date
            elif subscription.status == 'active' and subscription.current_period_end:
                end_date = subscription.current_period_end

            days_left = None
            if end_date:
                days_left = (end_date - timezone.now()).days

            show_renewal_notice = days_left is not None and 0 <= days_left <= 5

            subscription_type = "trial" if subscription.status == "trial" or subscription.status == "trial_expired" else "subscription"

            return {
                'is_view_only': is_view_only,
                'subscription_days_left': days_left,
                'show_renewal_notice': show_renewal_notice,
                'subscription_status': subscription.get_status_display(),
                'subscription_type': subscription_type,
            }
            
    return {}
