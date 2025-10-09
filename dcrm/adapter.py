import inngest
from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.core.exceptions import ImmediateHttpResponse
from scheduler.client import inngest_client
from django.conf import settings
from django.template.loader import render_to_string
from django.template import TemplateDoesNotExist
from django.contrib import messages
from django.shortcuts import redirect
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomEmailAdapter(DefaultAccountAdapter):
    def send_mail(self, template_prefix, email, context):
        if 'password_reset_url' in context:
            print(f"Password reset URL for {email}: {context['password_reset_url']}")

        subject = render_to_string(f"{template_prefix}_subject.txt", context)
        subject = " ".join(subject.splitlines()).strip()

        bodies = {}
        for ext in ["html", "txt"]:
            try:
                template_name = f"{template_prefix}_message.{ext}"
                bodies[ext] = render_to_string(
                    template_name,
                    context,
                    self.request,
                ).strip()
            except TemplateDoesNotExist:
                if ext == "txt" and not bodies:
                    # We need at least one body
                    raise
        
        txt_body = bodies.get("txt", "")
        html_body = bodies.get("html")

        inngest_client.send_sync(
            inngest.Event(
                name="emails/send.transactional",
                data={
                    "subject": subject,
                    "message": txt_body,
                    "from_email": settings.DEFAULT_FROM_EMAIL,
                    "recipient_list": [email],
                    "html_message": html_body,
                },
            )
        )


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        """
        Check if Google login is enabled for the user before allowing social login
        """
        # Only check for Google provider
        if sociallogin.account.provider != 'google':
            return

        # Get the email from the social account
        email = sociallogin.account.extra_data.get('email')
        if not email:
            messages.error(request, 'Unable to retrieve email from Google account.')
            raise ImmediateHttpResponse(redirect('login'))

        try:
            # Check if user exists and has Google login enabled
            user = User.objects.get(email=email)
            if not user.google_login_enabled:
                messages.error(
                    request,
                    'Google login is not enabled for your account. Please enable it in your account settings or login with your email and password.'
                )
                raise ImmediateHttpResponse(redirect('login'))
                
        except User.DoesNotExist:
            # User doesn't exist, prevent automatic signup
            messages.error(
                request,
                'No account found with this email address. Please signup first or login with your existing email and password.'
            )
            raise ImmediateHttpResponse(redirect('login'))

    def save_user(self, request, sociallogin, form=None):
        """
        Prevent automatic user creation via Google login
        """
        # This method should not be called due to SOCIALACCOUNT_AUTO_SIGNUP = False
        # But adding extra protection here
        if sociallogin.account.provider == 'google':
            messages.error(
                request,
                'Account creation via Google is not allowed. Please create an account first.'
            )
            raise ImmediateHttpResponse(redirect('login'))
        
        return super().save_user(request, sociallogin, form)