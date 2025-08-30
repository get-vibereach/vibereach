from clients.models import CustomUser, Subscription

from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.conf import settings

import logging
logger = logging.getLogger(__name__)


def send_system_subscription_status_email(user: CustomUser, subscription: Subscription, days_left: int=None):
    """
    Sends system emails (trial/subscription ending or expired).
    
    Args:
        user: CustomUser who owns the subscription
        subscription: Subscription object
        days_left: int, only set when "ending soon" (None if expired)
    """
    try:
        # Determine type (trial or subscription)
        type_ = "trial" if subscription.status == "trial" or subscription.status == "trial_expired" else "subscription"

        # Determine status (ending soon vs ended)
        status = "ending_soon" if days_left and days_left > 0 else "ended"

        # Build context for templates
        context = {
            "first_name": user.first_name,
            "status": status,          # "ending_soon" or "ended"
            "type": type_,             # "trial" or "subscription"
            "days_left": days_left,    # int or None
        }

        # Subject line
        subject = f"Your VibeReach {type_} is {'ending soon' if status == 'ending_soon' else 'expired'}"
        logger.info(f"type: {type_}")
        logger.info(f"📧 Subject: {subject}")

        # Render plain + html versions
        plain_text = render_to_string("emails/status/status.txt", context)
        html_content = render_to_string("emails/status/status.html", context)

        # Get recipient email
        recipient_email = subscription.billing_email
        recipient_name = user.get_full_name()

        # Build email
        email = EmailMultiAlternatives(
            subject=subject,
            body=plain_text,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[f"{recipient_name} <{recipient_email}>"],  # send to billing email
        )
        email.attach_alternative(html_content, "text/html")
        sent = email.send(fail_silently=False)

        if sent:
            logger.info(f"✅ Email sent successfully to {recipient_email}")
            return True
        else:
            logger.error(f"❌ Email sending failed to {recipient_email}")
            return False

    except Exception as e:
        logger.error(f"An unexpected error occurred in send_system_email: {e}")
        return False
