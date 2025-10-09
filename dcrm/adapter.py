import inngest
from allauth.account.adapter import DefaultAccountAdapter
from scheduler.client import inngest_client
from django.conf import settings
from django.template.loader import render_to_string
from django.template import TemplateDoesNotExist

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