# Inngest functions for campaign processing
import inngest
from scheduler.client import inngest_client

from django.utils import timezone
from django.conf import settings
import logging
from datetime import datetime, timedelta
from .models import MessageAssignment
from .services import AnalyticsService

logger = logging.getLogger(__name__)


# COMMENTED OUT - Using batch processing instead of individual message processing
# @inngest_client.create_function(
#     fn_id="personalize_message",
#     trigger=inngest.TriggerEvent(event="campaigns/personalize.message"),
# )
# def personalize_message_task(ctx: inngest.Context):
#     """
#     Inngest function to personalize a message using AI and save it to the database.
#     Rate limited to respect AI API limits.
#
#     DEPRECATED: Now using batch processing in personalize_and_send_all_emails_at_once
#     """
#     pass






# COMMENTED OUT - Using batch processing instead of individual campaign message processing
# @inngest_client.create_function(
#     fn_id="personalize_campaign_messages",
#     trigger=inngest.TriggerEvent(event="campaigns/personalize.campaign_messages"),
# )
# def personalize_campaign_messages_task(ctx: inngest.Context):
#     """
#     Inngest function to personalize all messages for a campaign.
#
#     DEPRECATED: Now using batch processing in personalize_and_send_all_emails_at_once
#     """
#     pass















# COMMENTED OUT - Using batch processing instead of individual email sending
# @inngest_client.create_function(
#     fn_id="send_email",
#     trigger=inngest.TriggerEvent(event="campaigns/send.email"),
# )
# def send_email_task(ctx: inngest.Context):
#     """
#     Inngest function to send an email for a message assignment.
#
#     DEPRECATED: Now using batch processing in personalize_and_send_all_emails_at_once
#     """
#     pass



















# COMMENTED OUT - Using batch processing instead of individual campaign email sending
# @inngest_client.create_function(
#     fn_id="send_campaign_emails",
#     trigger=inngest.TriggerEvent(event="campaigns/send.campaign_emails"),
# )
# def send_campaign_emails_task(ctx: inngest.Context):
#     """
#     Inngest function to send emails for all message assignments in a campaign.
#
#     DEPRECATED: Now using batch processing in personalize_and_send_all_emails_at_once
#     """
#     pass











@inngest_client.create_function(
    fn_id="personalize_and_send_all_emails",
    trigger=inngest.TriggerEvent(event="campaigns/personalize_and_send.all_emails"),
)
def personalize_and_send_all_emails_at_once(ctx: inngest.Context):
    """
    Inngest function to personalize and send all emails at once for a specific campaign.
    This function processes everything in batches to avoid creating too many individual events.

    Args:
        ctx.event.data.campaign_id: ID of the Campaign

    Returns:
        dict: Results of the operation
    """
    try:
        campaign_id = ctx.event.data.get("campaign_id")

        if not campaign_id:
            return {"status": "error", "message": "campaign_id is required"}

        # Get the campaign object
        from .models import Campaign
        try:
            campaign = Campaign.objects.get(id=campaign_id)
        except Campaign.DoesNotExist:
            error_msg = f"Campaign with ID {campaign_id} not found"
            return {
                'status': 'error',
                'message': error_msg,
                'campaign_id': campaign_id
            }

        logger.info(f"🚀 Starting campaign launch for {campaign.name} (ID: {campaign_id})")

        # Step 1: Personalize all messages that need personalization
        query = MessageAssignment.objects.filter(
            campaign_id=campaign_id,
            personlized_msg_to_send=''
        )

        personalize_count = query.count()
        logger.info(f"📝 Personalizing {personalize_count} messages")

        for message_assignment in query:
            success = message_assignment.personalize_with_ai(skip=True)
            if success:
                logger.info(f"✅ Personalized message for assignment ID {message_assignment.id}")
            else:
                logger.error(f"❌ Failed to personalize message for assignment ID {message_assignment.id}")

        # Step 2: Send all personalized emails
        send_query = MessageAssignment.objects.filter(
            campaign_id=campaign_id,
            sent=False,
            personlized_msg_to_send__gt=''
        )

        send_count = send_query.count()
        logger.info(f"📧 Sending {send_count} emails")

        from campaign.email_sender import send_campaign_email
        sent_successfully = 0

        for message_assignment in send_query:
            try:
                success = send_campaign_email(message_assignment, campaign)
                if success:
                    sent_successfully += 1
                    logger.info(f"✅ Email sent successfully to {message_assignment.campaign_lead.lead.email}")
                else:
                    logger.error(f"❌ Failed to send email to {message_assignment.campaign_lead.lead.email}")
            except Exception as e:
                logger.error(f"💥 Error sending email to {message_assignment.campaign_lead.lead.email}: {str(e)}")

        return {
            'status': 'success',
            'message': f'Campaign {campaign_id} launch completed successfully',
            'campaign_id': campaign_id,
            'campaign_name': campaign.name,
            'personalized_count': personalize_count,
            'sent_count': sent_successfully,
            'total_processed': send_count
        }

    except Exception as e:
        logger.error(f"Error launching campaign {campaign_id}: {str(e)}")
        return {
            'status': 'error',
            'message': str(e),
            'campaign_id': campaign_id
        }











# ============================================================================
# NEW RELIABLE ORCHESTRATION PATTERN (Fan-Out/Fan-In)
# ============================================================================

# The NEW Orchestrator Function
@inngest_client.create_function(
    fn_id="process_scheduled_emails",
    trigger=inngest.TriggerEvent(event="campaigns/process_scheduled_emails"),
)
def process_scheduled_emails_orchestrator(ctx: inngest.Context):
    """
    Orchestrates the entire campaign sending process.
    1. Finds all emails to send.
    2. Personalizes them.
    3. Fans out scheduled events for each individual email.
    4. Waits for all individual email events to complete.
    5. Triggers the final campaign completion event.
    """
    try:
        campaign_id = ctx.event.data.get("campaign_id")
        if not campaign_id:
            return {"status": "error", "message": "campaign_id is required"}

        logger.info(f"🚀 Orchestrating campaign launch for campaign {campaign_id}")

        from .models import Campaign, MessageAssignment
        from .scheduling_utils import create_rate_limiter_from_campaign

        campaign = Campaign.objects.get(id=campaign_id)

        # Step 1: Get all message assignments to be processed
        def get_assignments_to_process_step():
            # ... (this logic is the same as your updated code)
            logger.info(f"🔍 Querying message assignments for campaign {campaign_id}")
            campaign_options = campaign.campaign_options.first()
            query = MessageAssignment.objects.filter(campaign_id=campaign_id, sent=False)
            if campaign_options and campaign_options.stop_on_reply:
                replied_lead_ids = MessageAssignment.objects.filter(campaign_id=campaign_id, responded=True).values_list('campaign_lead_id', flat=True).distinct()
                query = query.exclude(campaign_lead_id__in=replied_lead_ids)
            
            ready_to_send_ids = []
            for assignment in query:
                if assignment.delayed_by_days and assignment.delayed_by_days > 0:
                    last_sent = MessageAssignment.objects.filter(campaign_id=campaign_id, campaign_lead=assignment.campaign_lead, sent=True, sent_at__isnull=False).order_by('-sent_at').first()
                    if last_sent:
                        if (timezone.now() - last_sent.sent_at).days >= assignment.delayed_by_days: ready_to_send_ids.append(assignment.id)
                    else: ready_to_send_ids.append(assignment.id)
                else: ready_to_send_ids.append(assignment.id)
            
            return [a.id for a in query.filter(id__in=ready_to_send_ids)]
        
        assignment_ids = ctx.step.run("get-assignments", get_assignments_to_process_step)

        if not assignment_ids:
            logger.info(f"🏁 No emails to process for campaign {campaign_id}, triggering completion.")
            ctx.step.send_event("send-completion-no-emails", inngest.Event(name="campaigns/complete", data={"campaign_id": campaign_id}))
            return {"status": "success", "message": "No emails to process"}

        # Step 2: Personalize all messages
        ctx.step.run("personalize-messages", lambda: [
            ma.personalize_with_ai(skip=True) for ma in MessageAssignment.objects.filter(id__in=assignment_ids, personlized_msg_to_send='')
        ])
        
        assignments = list(MessageAssignment.objects.filter(id__in=assignment_ids, personlized_msg_to_send__gt='', sent=False))
        if not assignments:
            # Handle case where personalization failed for all
            logger.warning(f"No assignments left to send for campaign {campaign_id} after personalization. Completing.")
            ctx.step.send_event("send-completion-no-personalized", inngest.Event(name="campaigns/complete", data={"campaign_id": campaign_id}))
            return {"status": "success", "message": "No personalized messages to send"}


        # Step 3: Fan-out sends for today and schedule continuation if needed
        def fan_out_and_reschedule():
            rate_limiter = create_rate_limiter_from_campaign(campaign)
            if not rate_limiter:
                raise Exception("No active email accounts found for campaign")

            total_to_process = len(assignments)
            capacity_today = rate_limiter.total_daily_capacity
            
            num_to_send_today = min(total_to_process, capacity_today)
            
            assignments_for_today = assignments[:num_to_send_today]
            
            has_more = total_to_process > num_to_send_today

            if not assignments_for_today:
                if has_more:
                    # This case means we have emails to send, but zero capacity today.
                    logger.info(f"No capacity to send emails today for campaign {campaign_id}. Scheduling for tomorrow.")
                    from .scheduling_utils import create_scheduler_from_campaign
                    scheduler = create_scheduler_from_campaign(campaign)
                    if scheduler:
                        now_in_tz = timezone.now().astimezone(scheduler.timezone)
                        start_of_tomorrow = (now_in_tz + timedelta(days=1)).replace(hour=scheduler.from_time.hour, minute=scheduler.from_time.minute, second=0, microsecond=0)
                        next_run_time = scheduler.get_next_valid_send_time(from_datetime=start_of_tomorrow)
                        
                        inngest_client.send_sync(inngest.Event(
                            name="campaigns/process_scheduled_emails",
                            data={"campaign_id": campaign.id},
                            ts=int(next_run_time.timestamp() * 1000)
                        ))
                        logger.info(f"Next campaign run scheduled for {next_run_time.isoformat()}")
                return [], False

            # Calculate schedule for today's batch
            send_schedule = rate_limiter.calculate_send_schedule(len(assignments_for_today), timezone.now())

            events_to_send = []
            for assignment, schedule_item in zip(assignments_for_today, send_schedule):
                events_to_send.append(inngest.Event(
                    name="campaigns/send_single_email",
                    data={
                        "campaign_id": campaign.id,
                        "message_assignment_id": assignment.id,
                        "email_account_id": schedule_item['account'].id,
                        "orchestrator_run_id": ctx.run_id,
                    },
                    ts=int(schedule_item['send_time'].timestamp() * 1000)
                ))
            
            if events_to_send:
                inngest_client.send_sync(events_to_send)
                logger.info(f"📬 Fanned out {len(events_to_send)} scheduled send events for campaign {campaign_id} for today.")

            return assignments_for_today, has_more

        assignments_today, has_more = ctx.step.run("fan-out-and-reschedule", fan_out_and_reschedule)

        if not assignments_today:
            return {"status": "rescheduled", "message": "No capacity today, rescheduled for next available day."}

        # Step 4: Wait for acknowledgements for today's batch
        for assignment in assignments_today:
            ctx.step.wait_for_event(
                f"wait-for-ack-{assignment.id}",
                event=f"campaigns/email.sent.ack/{ctx.run_id}",
                timeout=timedelta(hours=24),
            )
            logger.info(f"👍 Received ACK for MA ID {assignment.id}")

        logger.info(f"🏁 All {len(assignments_today)} email acknowledgements received for campaign {campaign_id} for this batch.")

        if has_more:
            # Schedule the next run
            logger.info(f"Batch complete for campaign {campaign_id}. Scheduling continuation as more emails are pending.")
            from .scheduling_utils import create_scheduler_from_campaign
            scheduler = create_scheduler_from_campaign(campaign)
            if scheduler:
                now_in_tz = timezone.now().astimezone(scheduler.timezone)
                start_of_tomorrow = (now_in_tz + timedelta(days=1)).replace(hour=scheduler.from_time.hour, minute=scheduler.from_time.minute, second=0, microsecond=0)
                next_run_time = scheduler.get_next_valid_send_time(from_datetime=start_of_tomorrow)
                
                ctx.step.send_event(
                    "schedule-continuation",
                    inngest.Event(
                        name="campaigns/process_scheduled_emails",
                        data={"campaign_id": campaign.id},
                        ts=int(next_run_time.timestamp() * 1000)
                    )
                )
                logger.info(f"Next campaign run scheduled for {next_run_time.isoformat()}")
            
            return {"status": "success", "message": f"Campaign {campaign_id} batch processed. Continuation scheduled."}
        else:
            # This was the last batch, trigger completion
            logger.info(f"Final batch complete for campaign {campaign_id}. Triggering campaign completion.")
            ctx.step.send_event(
                "send-completion-event",
                inngest.Event(name="campaigns/complete", data={"campaign_id": campaign_id})
            )
            return {"status": "success", "message": f"Campaign {campaign_id} orchestration complete."}

    except Exception as e:
        logger.error(f"Error in orchestrator for campaign {ctx.event.data.get('campaign_id')}: {str(e)}", exc_info=True)
        return {"status": "error", "message": str(e)}


# The NEW Worker Function
@inngest_client.create_function(
    fn_id="send_single_email",
    trigger=inngest.TriggerEvent(event="campaigns/send_single_email"),
)
def send_single_email(ctx: inngest.Context):
    """
    Worker function to send one email.
    After sending, it sends an acknowledgement event back to the orchestrator.
    """
    campaign_id = ctx.event.data.get("campaign_id")
    message_assignment_id = ctx.event.data.get("message_assignment_id")
    email_account_id = ctx.event.data.get("email_account_id")
    orchestrator_run_id = ctx.event.data.get("orchestrator_run_id")

    # The core logic of sending an email
    from .models import Campaign, MessageAssignment
    from clients.models import EmailAccount
    from campaign.email_sender import send_campaign_email_with_account

    try:
        campaign = Campaign.objects.get(id=campaign_id)
        message_assignment = MessageAssignment.objects.get(id=message_assignment_id)
        email_account = EmailAccount.objects.get(id=email_account_id)

        if not message_assignment.sent and not message_assignment.should_skip_sending_due_to_reply():
            send_campaign_email_with_account(message_assignment, campaign, email_account)

    except Exception as e:
        logger.error(f"Error sending email for MA ID {message_assignment_id}: {str(e)}", exc_info=True)
    
    finally:
        # ALWAYS send an acknowledgement, even if sending failed.
        # The orchestrator only cares that the attempt was made.
        if orchestrator_run_id:
            inngest_client.send_sync(inngest.Event(
                name=f"campaigns/email.sent.ack/{orchestrator_run_id}",
                data={
                    "campaign_id": campaign_id,
                    "message_assignment_id": message_assignment_id,
                }
            ))

    return {"status": "complete", "message_assignment_id": message_assignment_id}



# Helper function for backward compatibility
def personalize_and_send_all_emails_at_once_sync(campaign_id):
    """
    Synchronous helper function to trigger the Inngest function.
    Used for backward compatibility with existing code.
    """
    try:
        inngest_client.send_sync(
            inngest.Event(
                name="campaigns/campaign.scheduled",
                data={"object_id": campaign_id}
            )
        )
        return {
            'status': 'success',
            'message': f'Campaign {campaign_id} launch initiated successfully',
            'campaign_id': campaign_id
        }
    except Exception as e:
        logger.error(f"Error triggering campaign launch {campaign_id}: {str(e)}")
        return {
            'status': 'error',
            'message': str(e),
            'campaign_id': campaign_id
        }


# ============================================================================
# ANALYTICS AND MAINTENANCE TASKS
# ============================================================================

@inngest_client.create_function(
    fn_id="reset_daily_email_limits",
    trigger=inngest.TriggerCron(cron="0 0 * * *"),  # Daily at midnight UTC
)
def reset_daily_email_limits(ctx: inngest.Context):
    """
    Reset daily email counts for all email accounts.
    Runs daily at midnight UTC to reset the emails_sent counter.
    """
    try:
        logger.info("🔄 Starting daily email limit reset")

        from clients.models import EmailAccount

        # Reset all email accounts that have sent emails
        updated_count = EmailAccount.objects.filter(emails_sent__gt=0).update(emails_sent=0)

        logger.info(f"✅ Reset daily email counts for {updated_count} email accounts")

        return {
            "status": "success",
            "message": f"Reset daily email counts for {updated_count} email accounts",
            "updated_count": updated_count
        }

    except Exception as e:
        logger.error(f"💥 Error resetting daily email limits: {str(e)}")
        import traceback
        logger.error(f"💥 Full traceback:\n{traceback.format_exc()}")
        return {
            "status": "error",
            "message": str(e)
        }


@inngest_client.create_function(
    fn_id="calculate_daily_stats",
    trigger=inngest.TriggerEvent(event="analytics/calculate_daily_stats"),
)
def calculate_daily_stats(ctx: inngest.Context):
    """
    Calculate daily stats for a specific campaign.
    Triggered by event with campaign_id and optional target_date.
    """
    try:
        campaign_id = ctx.event.data.get("campaign_id")
        target_date_str = ctx.event.data.get("target_date")  # YYYY-MM-DD format

        if not campaign_id:
            return {"status": "error", "message": "campaign_id is required"}

        logger.info(f"📊 Calculating daily stats for campaign {campaign_id}")

        from .models import Campaign, CampaignDailyStats
        from datetime import datetime

        # Get the campaign
        campaign = Campaign.objects.get(id=campaign_id)

        # Parse target date if provided
        target_date = None
        if target_date_str:
            target_date = datetime.strptime(target_date_str, '%Y-%m-%d').date()

        # Calculate daily stats
        daily_stats = CampaignDailyStats.calculate_daily_stats(campaign, target_date)

        logger.info(f"✅ Calculated daily stats for campaign {campaign.name} on {daily_stats.date}")

        return {
            "status": "success",
            "message": f"Daily stats calculated for {campaign.name}",
            "campaign_id": campaign_id,
            "date": daily_stats.date.isoformat(),
            "stats": {
                "emails_sent": daily_stats.emails_sent_today,
                "emails_opened": daily_stats.opens_today,
                "links_clicked": daily_stats.clicks_today,
                "replies_received": daily_stats.replies_today
            }
        }

    except Exception as e:
        logger.error(f"💥 Error calculating daily stats: {str(e)}")
        import traceback
        logger.error(f"💥 Full traceback:\n{traceback.format_exc()}")
        return {
            "status": "error",
            "message": str(e),
            "campaign_id": campaign_id if 'campaign_id' in locals() else None
        }


@inngest_client.create_function(
    fn_id="calculate_all_campaigns_daily_stats",
    trigger=inngest.TriggerCron(cron="0 1 * * *"),  # Daily at 1 AM UTC
)
def calculate_all_campaigns_daily_stats(ctx: inngest.Context):
    """
    Calculate daily stats for all active campaigns.
    Runs daily at 1 AM UTC (after email limit reset).
    """
    try:
        logger.info("📊 Starting daily stats calculation for all active campaigns")

        from .models import Campaign, CampaignDailyStats

        # Get all active campaigns
        campaigns = Campaign.objects.filter(status='active')
        count = campaigns.count()

        logger.info(f"📊 Found {count} active campaigns for daily stats calculation")

        # Trigger individual calculation for each campaign
        for campaign in campaigns:
            from django.utils import timezone
            target_date = timezone.now().date()
            daily_stats = CampaignDailyStats.calculate_daily_stats(campaign, target_date)
            logger.info(f"✅ Calculated daily stats for campaign {campaign.name} on {daily_stats.date}")


        logger.info(f"✅ Scheduled daily stats calculation for {count} campaigns")

        return {
            "status": "success",
            "message": f"Scheduled daily stats calculation for {count} campaigns",
            "campaigns_count": count
        }

    except Exception as e:
        logger.error(f"💥 Error scheduling daily stats calculation: {str(e)}")
        import traceback
        logger.error(f"💥 Full traceback:\n{traceback.format_exc()}")
        return {
            "status": "error",
            "message": str(e)
        }


@inngest_client.create_function(
    fn_id="calculate_all_campaigns_overall_stats",
    trigger=inngest.TriggerCron(cron="0 1 * * *"),  # Daily at 1 AM UTC
)
def calculate_all_campaigns_overall_stats(ctx: inngest.Context):
    """
    Calculate overall stats for all active campaigns.
    Runs daily at 1 AM UTC (after email limit reset).
    """
    try:
        logger.info("📊 Starting overall stats calculation for all active campaigns")

        from .models import Campaign, CampaignStats

        # Get all active campaigns
        campaigns = Campaign.objects.filter(status='active')
        count = campaigns.count()

        logger.info(f"📊 Found {count} active campaigns for overall stats calculation")

        # Perform full recalculation to ensure accuracy
        AnalyticsService.batch_update_campaigns(campaigns)
            
        logger.info(f"✅ Scheduled overall stats calculation for {count} campaigns")

        return {
            "status": "success",
            "message": f"Scheduled overall stats calculation for {count} campaigns",
            "campaigns_count": count
        }

    except Exception as e:
        logger.error(f"💥 Error scheduling overall stats calculation: {str(e)}")
        import traceback
        logger.error(f"💥 Full traceback:\n{traceback.format_exc()}")
        return {
            "status": "error",
            "message": str(e)
        }


@inngest_client.create_function(
    fn_id="complete_campaign",
    trigger=inngest.TriggerEvent(event="campaigns/complete"),
)
def complete_campaign(ctx: inngest.Context):
    """
    Complete a campaign when all message assignments are sent.
    Updates campaign status and releases email accounts.
    """
    try:
        campaign_id = ctx.event.data.get("campaign_id")

        if not campaign_id:
            return {"status": "error", "message": "campaign_id is required"}

        logger.info(f"🏁 Completing campaign {campaign_id}")

        from .models import Campaign, MessageAssignment

        # Get the campaign
        campaign = Campaign.objects.get(id=campaign_id)

        # Check if all message assignments are sent
        pending_assignments = MessageAssignment.objects.filter(
            campaign=campaign,
            sent=False
        ).count()

        if pending_assignments > 0:
            logger.warning(f"⚠️ Campaign {campaign_id} still has {pending_assignments} pending assignments")
            return {
                "status": "warning",
                "message": f"Campaign still has {pending_assignments} pending assignments",
                "campaign_id": campaign_id,
                "pending_assignments": pending_assignments
            }

        # Update campaign status
        campaign.status = 'completed'
        campaign.is_active = False
        campaign.save(update_fields=['status', 'is_active'])

        # Release email accounts from campaign options
        campaign_options = campaign.campaign_options.first()
        if campaign_options:
            email_accounts = list(campaign_options.email_accounts.all())
            campaign_options.email_accounts.clear()

            logger.info(f"🔓 Released {len(email_accounts)} email accounts from campaign {campaign.name}")
            for account in email_accounts:
                logger.info(f"  - Released: {account.email}")

        logger.info(f"✅ Campaign {campaign.name} completed successfully")

        return {
            "status": "success",
            "message": f"Campaign {campaign.name} completed successfully",
            "campaign_id": campaign_id,
            "campaign_name": campaign.name,
            "released_accounts": len(email_accounts) if 'email_accounts' in locals() else 0
        }

    except Exception as e:
        logger.error(f"💥 Error completing campaign: {str(e)}")
        import traceback
        logger.error(f"💥 Full traceback:\n{traceback.format_exc()}")
        return {
            "status": "error",
            "message": str(e),
            "campaign_id": campaign_id if 'campaign_id' in locals() else None
        }


# =============================================================================
# SUBSCRIPTION MANAGEMENT TASKS
# ============================================================================

@inngest_client.create_function(
    fn_id="check_subscriptions",
    trigger=inngest.TriggerCron(cron="0 0 1,16 * *"),  # 1st and 16th of every month at 12 AM UTC
)
def check_subscriptions(ctx: inngest.Context):
    """
    Checks all subscriptions daily.
    - Triggers notifications for subscriptions ending soon.
    - Triggers expiration for subscriptions that have ended.
    """
    from django.utils import timezone
    from datetime import timedelta
    from django.db.models import Q
    from clients.models import Subscription

    today = timezone.now().date()
    
    # Subscriptions ending soon (active or trial)
    subscriptions_ending_soon = Subscription.objects.filter(
        status__in=['active', 'trial']
    ).filter(
        Q(trial_end_date__date__range=(today, today + timedelta(days=5))) |
        Q(current_period_end__date__range=(today, today + timedelta(days=5)))
    )

    events = []
    for sub in subscriptions_ending_soon:
        events.append(inngest.Event(
            name="subscriptions/notify.ending_soon",
            data={"subscription_id": sub.id}
        ))

    # Expired subscriptions
    expired_subscriptions = Subscription.objects.filter(
        status__in=['active', 'trial']
    ).filter(
        Q(trial_end_date__date__lt=today) |
        Q(current_period_end__date__lt=today)
    )

    for sub in expired_subscriptions:
        events.append(inngest.Event(
            name="subscriptions/notify.expired",
            data={"subscription_id": sub.id}
        ))
    
    if events:
        inngest_client.send_sync(events)

    logger.info(f"Subscription check complete. Found {len(subscriptions_ending_soon)} ending soon, {len(expired_subscriptions)} expired.")
    return {"status": "complete", "ending_soon": len(subscriptions_ending_soon), "expired": len(expired_subscriptions)}


@inngest_client.create_function(
    fn_id="notify_ending_soon",
    trigger=inngest.TriggerEvent(event="subscriptions/notify.ending_soon"),
)
def notify_ending_soon(ctx: inngest.Context):
    """
    Sends a notification that a subscription is about to expire.
    """
    from django.utils import timezone
    from clients.models import Subscription
    from campaign.system_emails import send_system_subscription_status_email

    subscription_id = ctx.event.data.get("subscription_id")
    
    try:
        sub = Subscription.objects.get(id=subscription_id)
        
        end_date = sub.trial_end_date if sub.status == 'trial' else sub.current_period_end
        if not end_date:
            return {"status": "error", "message": "No end date found"}

        days_left = (end_date.date() - timezone.now().date()).days

        if 0 <= days_left <= 5:
            if sub.days_to_expiry_warning_sent == days_left:
                logger.info(f"Notification for {days_left} days left already sent for sub {sub.id}")
                return {"status": "skipped", "reason": "already notified for this day"}

            user = sub.subscribed_company.users.filter(is_staff=True).first() or sub.subscribed_company.users.first()

            if user:
                # This uses a generic template. A more advanced version could pass days_left to the template.
                send_system_subscription_status_email(user, sub, days_left)
                
                sub.days_to_expiry_warning_sent = days_left
                sub.save(update_fields=['days_to_expiry_warning_sent'])
                logger.info(f"Sent 'ending soon' notification to {user.email} for sub {sub.id}")
                return {"status": "success", "user_notified": user.email}
            else:
                logger.warning(f"No user found to notify for subscription {sub.id}")
                return {"status": "error", "message": "No user found"}

    except Subscription.DoesNotExist:
        logger.error(f"Subscription with ID {subscription_id} not found.")
        return {"status": "error", "message": "Subscription not found"}


@inngest_client.create_function(
    fn_id="notify_expired",
    trigger=inngest.TriggerEvent(event="subscriptions/notify.expired"),
)
def notify_expired(ctx: inngest.Context):
    """
    Handles subscription expiration.
    - Sets status to 'expired'.
    - Moves users to 'View Only' group.
    - Sends an expiration email.
    """
    from django.contrib.auth.models import Group
    from clients.models import Subscription
    from campaign.system_emails import send_system_subscription_status_email

    subscription_id = ctx.event.data.get("subscription_id")

    try:
        sub = Subscription.objects.get(id=subscription_id)

        if sub.status == 'expired':
            logger.info(f"Subscription {sub.id} already expired.")
            return {"status": "skipped", "reason": "already expired"}

        # Update subscription status
        if sub.status == 'trial':
            sub.status = 'trial_expired'
            sub.save(update_fields=['status'])
        else:
            sub.status = 'expired'
            sub.save(update_fields=['status'])

        # Add users to 'View Only' group
        try:
            view_only_group = Group.objects.get(name='View Only')
            users = sub.subscribed_company.users.all()
            for user in users:
                user.groups.add(view_only_group)
            logger.info(f"Moved {users.count()} users from company {sub.subscribed_company.name} to 'View Only' group.")
        except Group.DoesNotExist:
            logger.error("'View Only' group not found. Please run 'manage.py setup_permissions'.")
            return {"status": "error", "message": "View Only group not found"}

        # Send notification if not already sent
        if not sub.expiry_notification_sent:
            user_to_notify = sub.subscribed_company.users.filter(is_staff=True).first() or sub.subscribed_company.users.first()
            if user_to_notify:
                send_system_subscription_status_email(user_to_notify, sub)
                sub.expiry_notification_sent = True
                sub.save(update_fields=['expiry_notification_sent'])
                logger.info(f"Sent 'expired' notification to {user_to_notify.email} for sub {sub.id}")
                return {"status": "success", "user_notified": user_to_notify.email}
        
        return {"status": "success", "message": "Subscription expired, no new notification sent."}

    except Subscription.DoesNotExist:
        logger.error(f"Subscription with ID {subscription_id} not found.")
        return {"status": "error", "message": "Subscription not found"}






@inngest_client.create_function(
    fn_id="notify_admin_on_new_user",
    trigger=inngest.TriggerEvent(event="users/new.user.registered"),
)
def notify_admin_on_new_user_task(ctx: inngest.Context):
    """
    notifying admin on new user registration
    """
    from .system_emails import send_admin_new_user_notification
    from clients.models import CustomUser, SubscribedCompany

    user_id = ctx.event.data.get("user_id")
    company_id = ctx.event.data.get("company_id")

    try:
        user = CustomUser.objects.get(id=user_id)
        company = SubscribedCompany.objects.get(id=company_id)
        login_token_url = ctx.event.data.get("login_token_url")
        send_admin_new_user_notification(user, company, login_token_url)
    except (CustomUser.DoesNotExist, SubscribedCompany.DoesNotExist) as e:
        logger.error(f"Could not send admin notification: {e}")
        return {"status": "error", "message": str(e)}
    return {"status": "success"}
