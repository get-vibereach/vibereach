
import random
from datetime import timedelta, date
from django.core.management.base import BaseCommand
from django.utils import timezone
from campaign.models import Campaign, CampaignStats, MessageAssignment, CampaignDailyStats, CampaignLead

class Command(BaseCommand):
    help = 'Populates the database with realistic campaign stats for dashboard screenshots.'

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting to populate campaign stats...")

        campaign_ids = [44, 49]
        try:
            campaigns = Campaign.objects.filter(id__in=campaign_ids)
            if campaigns.count() != 2:
                raise Campaign.DoesNotExist
        except Campaign.DoesNotExist:
            self.stdout.write(self.style.ERROR("Campaigns with IDs 44 and 49 not found."))
            return

        # 1. Set Campaign Status
        campaign_44 = campaigns.get(id=44)
        campaign_44.status = 'completed'
        campaign_44.save()
        self.stdout.write(self.style.SUCCESS(f"Campaign {campaign_44.id} status set to 'completed'."))

        campaign_49 = campaigns.get(id=49)
        campaign_49.status = 'active'
        campaign_49.save()
        self.stdout.write(self.style.SUCCESS(f"Campaign {campaign_49.id} status set to 'active'."))

        # 2. Create CampaignStats for both campaigns
        stats_44, _ = CampaignStats.objects.get_or_create(campaign=campaign_44)
        stats_49, _ = CampaignStats.objects.get_or_create(campaign=campaign_49)
        self.stdout.write("CampaignStats objects created or retrieved for both campaigns.")

        # 3. Update MessageAssignment properties
        self.process_message_assignments(campaign_44, is_completed=True)
        self.process_message_assignments(campaign_49, is_completed=False)

        # 4. Create CampaignDailyStats
        self.create_daily_stats(campaign_44, days=30)
        self.create_daily_stats(campaign_49, days=40) # Active campaign has fewer days of data

        # 5. Final Calculation
        self.stdout.write("Updating final campaign stats from campaign data...")
        stats_44.update_from_campaign()
        stats_49.update_from_campaign()
        self.stdout.write(self.style.SUCCESS("Final campaign stats updated."))

        self.stdout.write(self.style.SUCCESS("Successfully populated campaign stats."))

    def process_message_assignments(self, campaign, is_completed):
        self.stdout.write(f"Processing message assignments for campaign {campaign.id}...")
        msg_assignments = list(MessageAssignment.objects.filter(campaign=campaign))
        total_assignments = len(msg_assignments)

        if total_assignments == 0:
            self.stdout.write(self.style.WARNING(f"No message assignments found for campaign {campaign.id}."))
            return

        now = timezone.now()
        for i, assignment in enumerate(msg_assignments):
            assignment.sent = False
            assignment.opened = False
            assignment.responded = False
            assignment.visit_count = 0
            assignment.sent_at = None
            assignment.opened_at = None
            assignment.responded_at = None
            assignment.visited_at = None
            assignment.save()
            
            if is_completed or (i < total_assignments * 0.7): # 70% sent for active campaign
                assignment.sent = True
                assignment.sent_at = now - timedelta(days=random.randint(1, 15))
                assignment.save()

        sent_assignments = [m for m in MessageAssignment.objects.filter(campaign=campaign) if m.sent]
        num_sent = len(sent_assignments)

        # Realistic open rates (15-25%)
        open_rate = random.uniform(0.15, 0.25)
        num_opens = int(num_sent * open_rate)
        opened_assignments = random.sample(sent_assignments, num_opens)

        for assignment in opened_assignments:
            assignment.opened = True
            assignment.opened_at = assignment.sent_at + timedelta(hours=random.randint(1, 48))
            assignment.save()

        # Realistic click rates (10-20% of opens)
        click_rate_of_opens = random.uniform(0.10, 0.20)
        num_clicks = int(num_opens * click_rate_of_opens)
        clicked_assignments = random.sample(opened_assignments, num_clicks)

        for assignment in clicked_assignments:
            assignment.visit_count = random.randint(1, 3)
            assignment.visited_at = assignment.opened_at + timedelta(minutes=random.randint(5, 60))
            assignment.save()

        # Realistic reply rates (1-5% of sent)
        reply_rate = random.uniform(0.01, 0.05)
        num_replies = int(num_sent * reply_rate)
        replied_assignments = random.sample(sent_assignments, num_replies)

        for assignment in replied_assignments:
            assignment.responded = True
            assignment.responded_at = (assignment.opened_at if assignment.opened_at else assignment.sent_at) + timedelta(hours=random.randint(1, 72))
            assignment.responded_content = "This is a simulated reply."
            assignment.save()
            
            campaign_lead = assignment.campaign_lead
            if campaign_lead.opportunity_status == 'none':
                campaign_lead.opportunity_status = 'positive'
                campaign_lead.opportunity_marked_at = assignment.responded_at
                campaign_lead.save()


        self.stdout.write(f"  - Total assignments: {total_assignments}")
        self.stdout.write(f"  - Marked as sent: {num_sent}")
        self.stdout.write(f"  - Marked as opened: {num_opens} ({open_rate:.2%})")
        self.stdout.write(f"  - Marked as clicked: {num_clicks}")
        self.stdout.write(f"  - Marked as replied: {num_replies} ({reply_rate:.2%})")


    def create_daily_stats(self, campaign, days):
        self.stdout.write(f"Creating daily stats for campaign {campaign.id} for {days} days...")
        today = timezone.now().date()
        
        CampaignDailyStats.objects.filter(campaign=campaign).delete()

        for i in range(days):
            target_date = today - timedelta(days=i)
            CampaignDailyStats.calculate_daily_stats(campaign, target_date)
        
        self.stdout.write(f"  - Created {days} daily stat entries.")
