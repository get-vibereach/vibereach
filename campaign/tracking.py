"""
Email tracking utilities using pytracking library
"""
import logging
from django.conf import settings
from django.urls import reverse
from pytracking import Configuration
from pytracking.html import adapt_html
from pytracking.django import OpenTrackingView, ClickTrackingView
from .models import MessageAssignment
from django.utils import timezone

logger = logging.getLogger(__name__)


def get_pytracking_configuration():
    """
    Get pytracking configuration based on Django settings
    """
    base_url = getattr(settings, 'SITE_URL', 'http://localhost:8000')
    
    # Remove trailing slash if present
    if base_url.endswith('/'):
        base_url = base_url[:-1]
    
    configuration = Configuration(
        base_open_tracking_url=f"{base_url}/campaign/tracking/open/",
        base_click_tracking_url=f"{base_url}/campaign/tracking/click/"
    )
    
    return configuration


def add_tracking_to_email(html_content, message_assignment):
    """
    Add open and click tracking to email HTML content using pytracking
    
    Args:
        html_content (str): Original HTML content
        message_assignment (MessageAssignment): The message assignment object
        
    Returns:
        str: HTML content with tracking pixels and link modifications
    """
    try:
        # Check if tracking is enabled for this campaign
        campaign_options = message_assignment.campaign.campaign_options.first()
        if not campaign_options:
            logger.warning(f"No campaign options found for campaign {message_assignment.campaign.id}")
            return html_content
            
        # Get configuration
        configuration = get_pytracking_configuration()
        
        # Create tracking context with message assignment ID
        tracking_context = {
            'message_assignment_id': message_assignment.id,
            'campaign_id': message_assignment.campaign.id,
            'lead_id': message_assignment.campaign_lead.lead.id,
        }
        
        # Apply tracking modifications based on what's enabled
        open_tracking = campaign_options.open_tracking_enabled
        click_tracking = campaign_options.link_tracking_enabled

        if open_tracking or click_tracking:
            logger.info(f"Adding tracking for message assignment {message_assignment.id} - Open: {open_tracking}, Click: {click_tracking}")
            tracked_html = adapt_html(
                html_content,
                extra_metadata=tracking_context,
                configuration=configuration,
                open_tracking=open_tracking,
                click_tracking=click_tracking
            )
        else:
            tracked_html = html_content
            logger.info(f"No tracking enabled for message assignment {message_assignment.id}")
        
        return tracked_html
        
    except Exception as e:
        logger.error(f"Error adding tracking to email for message assignment {message_assignment.id}: {str(e)}")
        # Return original content if tracking fails
        return html_content


class CustomOpenTrackingView(OpenTrackingView):
    """
    Custom open tracking view that integrates with our MessageAssignment model
    """

    def get_configuration(self):
        """
        Return the pytracking configuration
        """
        return get_pytracking_configuration()

    def notify_decoding_error(self, exception, request):
        """
        Handle decoding errors
        """
        logger.error(f"Open tracking decoding error: {str(exception)}")

    def notify_tracking_event(self, tracking_result):
        """
        Handle open tracking event and delegate analytics to the service layer.
        """
        try:
            metadata = tracking_result.metadata
            message_assignment_id = metadata.get('message_assignment_id')
            
            if not message_assignment_id:
                logger.warning("No message_assignment_id in tracking metadata")
                return
                
            try:
                message_assignment = MessageAssignment.objects.get(id=message_assignment_id)
            except MessageAssignment.DoesNotExist:
                logger.error(f"MessageAssignment {message_assignment_id} not found")
                return
            
            # Update message assignment if not already opened
            if not message_assignment.opened:
                message_assignment.opened = True
                message_assignment.opened_at = timezone.now()
                message_assignment.save(update_fields=['opened', 'opened_at'])
                
                logger.info(f"✅ Email opened: MessageAssignment {message_assignment_id}")
                
                # Use the centralized analytics service
                from .services import AnalyticsService
                AnalyticsService.handle_email_opened(message_assignment)
            else:
                logger.info(f"📧 Email already marked as opened: MessageAssignment {message_assignment_id}")
                
        except Exception as e:
            logger.error(f"Error handling open tracking event: {str(e)}")


class CustomClickTrackingView(ClickTrackingView):
    """
    Custom click tracking view that integrates with our MessageAssignment model
    """

    def get_configuration(self):
        """
        Return the pytracking configuration
        """
        return get_pytracking_configuration()

    def notify_decoding_error(self, exception, request):
        """
        Handle decoding errors
        """
        logger.error(f"Click tracking decoding error: {str(exception)}")

    def notify_tracking_event(self, tracking_result):
        """
        Handle click tracking event and delegate analytics to the service layer.
        """
        try:
            metadata = tracking_result.metadata
            message_assignment_id = metadata.get('message_assignment_id')
            
            if not message_assignment_id:
                logger.warning("No message_assignment_id in click tracking metadata")
                return
            
                
            try:
                message_assignment = MessageAssignment.objects.get(id=message_assignment_id)
            except MessageAssignment.DoesNotExist:
                logger.error(f"MessageAssignment {message_assignment_id} not found")
                return
            
            clicked_url = tracking_result.tracked_url
            if clicked_url:
                if not message_assignment.link:
                    message_assignment.link = clicked_url
                    message_assignment.save(update_fields=['link'])
                # Increment the visit count on the message assignment
                message_assignment.track_visit()
                
                logger.info(f"🔗 Link clicked for MessageAssignment {message_assignment_id}: {clicked_url}")
                
                # Use the centralized analytics service to handle the logic of updating stats
                from .services import AnalyticsService
                AnalyticsService.handle_message_assignment_visited(message_assignment)
                
        except Exception as e:
            logger.error(f"Error handling click tracking event: {str(e)}")