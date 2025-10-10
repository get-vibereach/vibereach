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
from urllib.parse import urlencode

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
        This method is called after successful social login, but before the user is
        actually logged into the system.

        We hook into it to check if this social login is part of the MCP OAuth flow.
        """
        # Check if this is an MCP flow by looking for our session variables
        mcp_auth_request_id = request.session.get('mcp_auth_request_id')
        mcp_state = request.session.get('mcp_state')

        if mcp_auth_request_id and mcp_state:
            # This is an MCP flow.
            mcp_server_url = getattr(settings, 'MCP_SERVER_URL', 'http://localhost:8001')

            # Get user details from the social login
            google_email = sociallogin.account.extra_data.get('email')
            if not google_email:
                messages.error(request, 'Unable to retrieve email from Google account for MCP flow.')
                raise ImmediateHttpResponse(redirect('login'))

            try:
                # Find the corresponding user in our system
                user = User.objects.get(google_email=google_email, google_login_enabled=True)

                # Success: Build the final callback URL for the MCP server
                params = {
                    'auth_request_id': mcp_auth_request_id,
                    'state': mcp_state,
                    'django_user_id': user.id,
                    'django_user_email': user.email
                }
                callback_url = f"{mcp_server_url}/oauth2/callback?{urlencode(params)}"
                
                # Clean up session and redirect
                del request.session['mcp_auth_request_id']
                del request.session['mcp_state']
                raise ImmediateHttpResponse(redirect(callback_url))

            except User.DoesNotExist:
                # Failure: User not found. Redirect back to MCP server with an error.
                params = {
                    'auth_request_id': mcp_auth_request_id,
                    'state': mcp_state,
                    'error': 'access_denied',
                    'error_description': 'This Google account is not linked to an active user in the system.'
                }
                error_callback_url = f"{mcp_server_url}/oauth2/callback?{urlencode(params)}"
                
                # Clean up session and redirect
                del request.session['mcp_auth_request_id']
                del request.session['mcp_state']
                raise ImmediateHttpResponse(redirect(error_callback_url))

        # If not an MCP flow, proceed with the original logic for normal site logins
        # Only check for Google provider
        if sociallogin.account.provider != 'google':
            return

        # Get the email from the social account
        google_email = sociallogin.account.extra_data.get('email')
        if not google_email:
            messages.error(request, 'Unable to retrieve email from Google account.')
            raise ImmediateHttpResponse(redirect('login'))

        # Check if this is a linking request (user is already logged in)
        if request.user.is_authenticated:
            # This is a Google account linking request
            if request.user.google_email:
                messages.error(request, 'You already have a Google account linked. Please disconnect it first.')
                raise ImmediateHttpResponse(redirect('account_settings'))
            
            # Link the Google email to the current user
            request.user.google_email = google_email
            request.user.google_login_enabled = True
            request.user.save()
            
            messages.success(request, f'Google account {google_email} has been successfully linked to your account.')
            raise ImmediateHttpResponse(redirect('account_settings'))
        
        # This is a login attempt
        try:
            # Find user by their linked Google email
            user = User.objects.get(google_email=google_email)
            
            if not user.google_login_enabled:
                messages.error(
                    request,
                    'Google login is disabled for your account. Please enable it in your account settings or login with your email and password.'
                )
                raise ImmediateHttpResponse(redirect('login'))
                
            # Set the user for login
            sociallogin.user = user
                
        except User.DoesNotExist:
            # No user found with this Google email
            messages.error(
                request,
                'No account found linked to this Google email. Please login with your business email and link your Google account in settings.'
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