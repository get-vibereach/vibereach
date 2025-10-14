import datetime
import json
import logging
import base64
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.conf import settings
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.serialization import load_pem_private_key
from api.utils import auto_unassign_if_list_empty
from clients.models import Product, EmailAccount
from campaign.models import Campaign, CampaignLead, CampaignOptions, CampaignStats, Lead, LeadList, Message, MessageAssignment, Schedule
from .serializers import CampaignOptionsSerializer, CampaignStatsSerializer, LeadSerializer, MessageAssignmentSerializer, ProductSerializer, EmailAccountSerializer, CampaignSerializer, MessageSerializer, LeadListSerializer, ScheduleSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework import viewsets
from rest_framework.decorators import api_view
from django.db import transaction
import uuid
from django.db.models import Q
from django.utils import timezone
from django.utils.decorators import method_decorator # for class based view: @method_decorator(cache_page(60*15), name='get')
from django.views.decorators.cache import cache_page # for function based view: @cache_page(60*15) but it under the method example @api_view(['GET'])
from django.core.cache import cache
CACHE_TIMEOUT_SECONDS = 60 * 15

# testing inggest
import inngest
from scheduler.client import inngest_client

logger = logging.getLogger(__name__)



class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class EmailAccountListCreateView(generics.ListCreateAPIView):
    queryset = EmailAccount.objects.all()
    serializer_class = EmailAccountSerializer

class EmailAccountRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = EmailAccount.objects.all()
    serializer_class = EmailAccountSerializer


@api_view(['POST'])
def test_email_account_connection(request, pk):
    """
    Test the connection for a specific email account
    """
    try:
        email_account = get_object_or_404(EmailAccount, pk=pk)
        result = email_account.test_connection()

        return Response({
            'success': result['success'],
            'message': result['message'],
            'account_email': email_account.email
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            'success': False,
            'message': f'Error testing connection: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CampaignListCreateView(generics.ListCreateAPIView):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer

class CampaignRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer


class MessageListCreateView(generics.ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

class MessageRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer


class MessageAssignmentListCreateView(generics.ListCreateAPIView):
    queryset = MessageAssignment.objects.all()
    serializer_class = MessageAssignmentSerializer

class MessageAssignmentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MessageAssignment.objects.all()
    serializer_class = MessageAssignmentSerializer

class MessageAssignmentBulkCreateView(APIView):
    def post(self, request):
        campaign_id = request.data.get("campaign_id")
        message_id = request.data.get("message_id")

        if not campaign_id or not message_id:
            return Response(
                {"error": "campaign_id and message_id are required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            campaign = Campaign.objects.get(id=campaign_id)
            message = Message.objects.get(id=message_id)
        except Campaign.DoesNotExist:
            return Response({"error": "Campaign not found."}, status=status.HTTP_404_NOT_FOUND)
        except Message.DoesNotExist:
            return Response({"error": "Message not found."}, status=status.HTTP_404_NOT_FOUND)

        # Get leads without this message assignment
        existing_assignments = MessageAssignment.objects.filter(
            campaign=campaign, 
            message=message
        ).values_list("campaign_lead_id", flat=True)

        campaign_leads = CampaignLead.objects.filter(campaign=campaign).exclude(
            id__in=existing_assignments
        ).select_related('lead')

        if not campaign_leads.exists():
            return Response(
                {"message": "All leads already have this message assigned."},
                status=status.HTTP_200_OK
            )

        # The logic for creating individual Link objects has been removed.
        # Instead, we now directly populate the 'link' CharField on the MessageAssignment.
        
        with transaction.atomic():
            assignments = []
            for lead in campaign_leads:
                assignments.append(MessageAssignment(
                    campaign=campaign,
                    campaign_lead=lead,
                    message=message,
                    link=campaign.product.landing_page_url,  # Populate the new simple link field
                    delayed_by_days=request.data.get("delayed_by_days", 0),
                    personlized_msg_tmp=message.full_content or ""
                ))
            
            # Bulk create assignments
            created_assignments = MessageAssignment.objects.bulk_create(assignments)
            
            # The logic for updating personalized content remains the same,
            # as it now correctly pulls from the message's full_content if the tmp field is empty.
            # However, since we populate `personlized_msg_tmp` during creation, this block is technically redundant
            # but is kept for safety in case the initial value is empty for any reason.
            batch_size = 500
            for i in range(0, len(created_assignments), batch_size):
                batch = created_assignments[i:i + batch_size]
                assignments_to_update = []
                for assignment in batch:
                    # The get_personalized_content_tmp now just returns the message content.
                    if not assignment.personlized_msg_tmp:
                        assignment.personlized_msg_tmp = assignment.get_personalized_content_tmp()
                        assignments_to_update.append(assignment)

                if assignments_to_update:
                    MessageAssignment.objects.bulk_update(
                        assignments_to_update, 
                        ['personlized_msg_tmp'],
                        batch_size=batch_size
                    )

        return Response(
            {
                "created": len(created_assignments),
                "campaign": campaign.name,
                "message": message.subject,
            },
            status=status.HTTP_201_CREATED,
        )


def campaign_sequence_message_assignments(request, message_id):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Unauthorized'}, status=401)
    
    try:
        data = json.loads(request.body)
        campaign_id = data.get('campaign_id')
        
        if not campaign_id:
            return JsonResponse({'error': 'campaign_id is required'}, status=400)
            
        assignments = MessageAssignment.objects.filter(
            message_id=message_id,
            campaign_id=campaign_id
        ).values(
            'id',
            'sent',
            'sent_at',
            'responded',
            'campaign_lead__lead__first_name',
            'campaign_lead__lead__last_name',
            'campaign_lead__lead__email'
        )
        return JsonResponse(list(assignments), safe=False)
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    

@api_view(['POST'])
def delete_assignments_by_message(request):
    message_id = request.data.get('message_id')
    campaign_id = request.data.get('campaign_id')

    if not message_id or not campaign_id:
        return Response({'error': 'message_id and campaign_id required'}, status=400)

    count, _ = MessageAssignment.objects.filter(
        message_id=message_id,
        campaign_id=campaign_id
    ).delete()

    return Response({'deleted': count}, status=200)


@api_view(['POST'])
def mark_assignment_as_replied(request, assignment_id):
    """
    Mark a message assignment as replied
    """
    try:
        assignment = MessageAssignment.objects.get(id=assignment_id)
    except MessageAssignment.DoesNotExist:
        return Response({'error': 'Assignment not found'}, status=404)

    reply_content = request.data.get('reply_content', '')

    success = assignment.mark_as_replied(reply_content)

    if success:
        return Response({
            'success': True,
            'message': 'Assignment marked as replied successfully'
        }, status=200)
    else:
        return Response({
            'error': 'Failed to mark assignment as replied or already replied'
        }, status=400)


class LeadListCreateView(generics.ListCreateAPIView):
    queryset = LeadList.objects.all()
    serializer_class = LeadListSerializer

class LeadListRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LeadList.objects.all()
    serializer_class = LeadListSerializer



class LeadListViewSet(viewsets.ModelViewSet):
    queryset = LeadList.objects.all()
    serializer_class = LeadListSerializer

    @action(detail=True, methods=["PATCH"])
    def assign_campaign(self, request, pk=None):
        lead_list = get_object_or_404(self.queryset, pk=pk)

        if not lead_list.lead_lists.all():
            return Response({'error': 'Cannot assign list to campaign if the list doesnot have any leads'}, status=status.HTTP_400_BAD_REQUEST)

        campaign_id = request.data.get("campaign_id")

        try:
            campaign = Campaign.objects.get(id=campaign_id)
            lead_list.campaigns.add(campaign)  # Add to ManyToMany

            leads = lead_list.lead_lists.all()  # Get all leads in the list
            campaign_leads = [
                CampaignLead(campaign=campaign, lead=lead)
                for lead in leads
            ]

            CampaignLead.objects.bulk_create(campaign_leads, ignore_conflicts=True)  # avoid duplicate


            return Response({"status": "success"})
        except Campaign.DoesNotExist:
            return Response({"error": "Campaign not found"}, status=400)

    @action(detail=True, methods=["PATCH"])
    def unassign_campaign(self, request, pk=None):
        lead_list = get_object_or_404(self.queryset, pk=pk)
        campaign_id = request.data.get("campaign_id")

        try:
            campaign = Campaign.objects.get(id=campaign_id)
            lead_list.campaigns.remove(campaign)  # Remove from ManyToMany

            leads = lead_list.lead_lists.all()

            CampaignLead.objects.filter(campaign=campaign, lead__in=leads).delete()

            return Response({"status": "success"})
        except Campaign.DoesNotExist:
            return Response({"error": "Campaign not found"}, status=400)




class LeadFieldsView(APIView):
    def get(self, request):
        fields = Lead.get_field_names(exclude=["id", "created_at", "tags"])
        return Response(fields)



class LeadCreateView(generics.ListCreateAPIView):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        email = data.get("email")
        subscribed_company = data.get("subscribed_company")

        # Check for duplicates
        exists = Lead.objects.filter(email=email, subscribed_company=subscribed_company).exists()

        if exists:
            response_data = {
                "message": "Duplicate lead found, not created",
                "created_count": 0,
                "duplicate_count": 1,
                "duplicates": [
                    {"full_name": data.get("full_name"), "email": email}
                ],
            }
            return Response(response_data, status=status.HTTP_200_OK)

        # Create new lead
        self.perform_create(serializer)

        response_data = {
            "message": "1 lead created successfully",
            "created_count": 1,
            "duplicate_count": 0,
            "duplicates": [],
        }
        return Response(response_data, status=status.HTTP_201_CREATED)


class LeadRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer



class BulkLeadCreateView(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        logger.info(f"Bulk lead create request received. Payload size: {len(data) if isinstance(data, list) else 'N/A'}")
        logger.debug(f"BulkLeadCreateView received data: {data}")

        if not isinstance(data, list):
            logger.error("BulkLeadCreateView error: request data is not a list")
            return Response({'error': 'Expected a list of leads'}, status=status.HTTP_400_BAD_REQUEST)

        # Validate all objects
        serializer = LeadSerializer(data=data, many=True)
        if not serializer.is_valid():
            logger.error(f"BulkLeadCreateView serializer errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data

        # Extract all (email, company_id) pairs from payload
        email_company_pairs = [
            (item["email"], item["subscribed_company"].id if item.get("subscribed_company") else None)
            for item in validated_data
        ]

        # Get existing leads in one query
        existing = Lead.objects.filter(
            Q(
                **{
                    "subscribed_company__in": [c for _, c in email_company_pairs if c is not None],
                    "email__in": [e for e, _ in email_company_pairs],
                }
            )
        ).values_list("email", "subscribed_company_id")

        existing_set = set(existing)

        new_leads = []
        duplicates = []

        for item in validated_data:
            company_id = item["subscribed_company"].id if item.get("subscribed_company") else None
            pair = (item["email"], company_id)

            if pair in existing_set:
                duplicates.append({"full_name": item.get("full_name"), "email": item.get("email")})
            else:
                new_leads.append(Lead(**item))

        # Bulk create new leads
        if new_leads:
            Lead.objects.bulk_create(new_leads)

        response_data = {
            "message": f"{len(new_leads)} leads created successfully",
            "created_count": len(new_leads),
            "duplicate_count": len(duplicates),
            "duplicates": duplicates,
        }

        return Response(response_data, status=status.HTTP_201_CREATED)



class BulkLeadDeleteView(APIView):
    def delete(self, request, *args, **kwargs):
        ids = request.data.get('ids', None)

        if not ids or not isinstance(ids, list):
            return Response({'error': 'Expected a list of lead IDs under "ids".'}, status=status.HTTP_400_BAD_REQUEST)

        # Filter leads by IDs and delete
        leads_to_delete = Lead.objects.filter(id__in=ids)
        count = leads_to_delete.count()
        leads_to_delete.delete()

        return Response({'message': f'{count} leads deleted successfully.'}, status=status.HTTP_200_OK)
    


class MoveLeadsToListView(APIView):
    def post(self, request):
        lead_ids = request.data.get('lead_ids')
        target_list_id = request.data.get('target_list_id')

        if not lead_ids or not target_list_id:
            return Response({'error': 'lead_ids and target_list_id are required'}, status=status.HTTP_400_BAD_REQUEST)

        target_list = get_object_or_404(LeadList, id=target_list_id)

        leads_to_move = Lead.objects.filter(id__in=lead_ids).exclude(lead_list=target_list)
        source_list_ids = leads_to_move.values_list("lead_list", flat=True).distinct()

        if not leads_to_move.exists():
            return Response({'status': 'no leads to move'}, status=status.HTTP_200_OK)

        # Handle campaign lead updates
        target_campaigns = set(target_list.campaigns.all())

        for source_list_id in source_list_ids:
            if not source_list_id:
                continue  # skip leads not in a list

            source_list = LeadList.objects.get(id=source_list_id)
            source_campaigns = set(source_list.campaigns.all())

            leads_from_this_source = leads_to_move.filter(lead_list=source_list)

            campaigns_to_add = target_campaigns - source_campaigns
            campaigns_to_remove = source_campaigns - target_campaigns

            # Delete old CampaignLeads (campaigns no longer assigned)
            if campaigns_to_remove:
                CampaignLead.objects.filter(
                    campaign__in=campaigns_to_remove,
                    lead__in=leads_from_this_source
                ).delete()

            # Create new CampaignLeads (campaigns newly assigned)
            campaign_leads_to_create = [
                CampaignLead(campaign=campaign, lead=lead)
                for campaign in campaigns_to_add
                for lead in leads_from_this_source
            ]
            if campaign_leads_to_create:
                CampaignLead.objects.bulk_create(campaign_leads_to_create, ignore_conflicts=True)

        # Update lead_list on the leads
        updated_count = leads_to_move.update(lead_list=target_list)
        
        # Unassign the original list if it's empty
        original_list = LeadList.objects.get(id=source_list_id)
        if original_list.campaigns:
            auto_unassign_if_list_empty(original_list)

        skipped_count = len(lead_ids) - updated_count

        return Response({
            'status': 'success',
            'moved_count': updated_count,
            'skipped_count': skipped_count
        }, status=status.HTTP_200_OK)




class ScheduleListCreateView(generics.ListCreateAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        # The 'campaign' instance is used for the lookup
        campaign_instance = validated_data.pop('campaign')

        # The rest of the data is used for the update/creation
        instance, created = Schedule.objects.update_or_create(
            campaign=campaign_instance,  # Lookup parameter
            defaults=validated_data      # Fields to update or create with
        )

        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        response_serializer = self.get_serializer(instance)
        
        headers = self.get_success_headers(response_serializer.data) if created else {}
        return Response(response_serializer.data, status=status_code, headers=headers)

class ScheduleRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer



class CampaignOptionsListCreateView(generics.ListCreateAPIView):
    queryset = CampaignOptions.objects.all()
    serializer_class = CampaignOptionsSerializer

    def create(self, request, *args, **kwargs):
        """Override create to use get_or_create to prevent duplicates"""
        campaign_id = request.data.get('campaign')

        if campaign_id:
            # Try to get existing campaign options first
            try:
                campaign_options = CampaignOptions.objects.get(campaign_id=campaign_id)
                # Update existing options
                serializer = self.get_serializer(campaign_options, data=request.data, partial=True)
                serializer.is_valid(raise_exception=True)
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            except CampaignOptions.DoesNotExist:
                # Create new options
                pass

        # Default create behavior for new options
        return super().create(request, *args, **kwargs)
    
        
class CampaignOptionsRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CampaignOptions.objects.all()
    serializer_class = CampaignOptionsSerializer





@api_view(['POST'])
def launch_campaign(request, pk):
    """
    Launch a campaign by personalizing and sending all emails
    """
    try:
        campaign = get_object_or_404(Campaign, pk=pk)

        # Check if email is hitting the rate limit
        from campaign.scheduling_utils import create_rate_limiter_from_campaign, get_assignments_for_immediate_processing

        # 1. Get the TRUE count of emails to be sent now
        assignments_to_send = get_assignments_for_immediate_processing(campaign)
        email_count_needed = assignments_to_send.count()

        if email_count_needed == 0:
            return Response({
                'success': False,
                'message': "This campaign has no emails ready to send at this time."
            }, status=status.HTTP_400_BAD_REQUEST)

        # 2. Check the rate limit
        rate_limiter = create_rate_limiter_from_campaign(campaign)

        if not rate_limiter:
            return Response({
                'success': False,
                'message': "No active email accounts are configured for this campaign."
            }, status=status.HTTP_400_BAD_REQUEST)

        allow_continuation = request.data.get('allow_continuation', False)

        if not rate_limiter.can_send_emails(email_count_needed) and not allow_continuation:
            capacity_details = rate_limiter.get_capacity_summary()
            # Return a detailed, structured error for the frontend
            return Response({
                'success': False,
                'error_code': 'CAPACITY_EXCEEDED', # A specific code for the frontend to check
                'message': 'Daily sending capacity exceeded.',
                'details': {
                    'needed': email_count_needed,
                    'available': capacity_details['total_daily_capacity'],
                    'summary': capacity_details['account_details']
                }
            }, status=status.HTTP_400_BAD_REQUEST)
        

        # Check if campaign has email accounts assigned
        campaign_options = campaign.campaign_options.first()
        if not campaign_options:

            return Response({
                'success': False,
                'message': 'Campaign has no options configured. Please configure campaign options first.'
            }, status=status.HTTP_400_BAD_REQUEST)


        # Check email accounts
        active_email_accounts = campaign_options.email_accounts.filter(status='active')
        if not active_email_accounts.exists():

            return Response({
                'success': False,
                'message': 'No active email accounts assigned to this campaign. Please assign email accounts first.'
            }, status=status.HTTP_400_BAD_REQUEST)


        # Check if campaign has message assignments
        message_assignments_count = MessageAssignment.objects.filter(
            campaign=campaign,
            sent=False
        ).count()

        if message_assignments_count == 0:
            return Response({
                'success': False,
                'message': 'No pending message assignments found for this campaign.'
            }, status=status.HTTP_400_BAD_REQUEST)


        try:
            # Create/get campaign stats first
            from campaign.services import AnalyticsService
            campaign_stats, _ = CampaignStats.objects.get_or_create(campaign=campaign)
            campaign_stats.update_basic_stats()

            # Create/get campaign scheduler first
            from campaign.models import Schedule
            Schedule.objects.get_or_create(
                campaign=campaign,
                subscribed_company=request.user.subscribed_company,
                )

            # Trigger the campaign scheduler event (this will handle everything)
            inngest_client.send_sync(
                inngest.Event(
                    name="campaigns/campaign.scheduled",
                    id=f"campaigns/campaign.scheduled.{campaign.id}",
                    data={"object_id": campaign.id},
                    # ts=int(time_delay)
                ))
            logger.info(f"🚀 Campaign {campaign.id} launch event sent to Inngest")

        except Exception as e:
            logger.error(f"Error launching campaign {campaign.id}: {str(e)}")
            return Response({
                'success': False,
                'message': f'Error launching campaign: {str(e)}',
                'campaign_id': campaign.id
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Update campaign status to active if it's not already
        if campaign.status != 'active':
            campaign.status = 'active'
            campaign.save(update_fields=['status'])

        return Response({
            'success': True,
            'message': f'Campaign "{campaign.name}" launched successfully',
            'campaign_id': campaign.id,
            'campaign_name': campaign.name,
            'pending_emails': message_assignments_count,
            #'task_id': task_result.id if hasattr(task_result, 'id') else None,
            'status': 'launched'
        }, status=status.HTTP_200_OK)


    except Exception as e:
        logger.error(f"Unexpected error launching campaign {pk}: {str(e)}")
        return Response({
            'success': False,
            'message': f'Error launching campaign: {str(e)}',
            'error_type': 'unexpected_error',
            'campaign_id': pk
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@cache_page(60*15)
def campaign_launch_status(request, pk):
    """
    Get the launch status and statistics for a campaign
    """
    try:
        campaign = get_object_or_404(Campaign, pk=pk)

        try:
            campaign.campaign_stats  # This may raise RelatedObjectDoesNotExist
        except:
            return Response({
                'success': False,
                'message': f'Campaign {campaign.name} has no created stats yet'
            }, status=status.HTTP_404_NOT_FOUND)

        # Get message assignment statistics
        total_assignments = MessageAssignment.objects.filter(campaign=campaign).count()
        sent_assignments = MessageAssignment.objects.filter(campaign=campaign, sent=True).count()
        pending_assignments = total_assignments - sent_assignments

        # Get personalization statistics
        personalized_assignments = MessageAssignment.objects.filter(
            campaign=campaign,
            personlized_msg_to_send__gt=''
        ).count()

        # Get email account information
        campaign_options = campaign.campaign_options.first()
        email_accounts_info = []

        if campaign_options:
            email_accounts = campaign_options.email_accounts.filter(status='active')
            for account in email_accounts:
                email_accounts_info.append({
                    'email': account.email,
                    'emails_sent_today': account.emails_sent,
                    'daily_limit': account.daily_limit,
                    'remaining_capacity': account.daily_limit - account.emails_sent
                })

        return Response({
            'success': True,
            'campaign_id': campaign.id,
            'campaign_name': campaign.name,
            'campaign_status': campaign.status,
            'statistics': {
                'total_message_assignments': total_assignments,
                'sent_emails': sent_assignments,
                'pending_emails': pending_assignments,
                'personalized_messages': personalized_assignments,
                'completion_percentage': round((sent_assignments / total_assignments * 100) if total_assignments > 0 else 0, 2)
            },
            'email_accounts': email_accounts_info,
            'is_complete': pending_assignments == 0
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            'success': False,
            'message': f'Error getting campaign status: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)








class CampaignStatsListCreateView(generics.ListCreateAPIView):
    queryset = CampaignStats.objects.all()
    serializer_class = CampaignStatsSerializer

class CampaignStatsRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CampaignStats.objects.all()
    serializer_class = CampaignStatsSerializer


@api_view(['POST'])
def update_opportunity_value(request, campaign_id):
    """
    Update the opportunity value for a campaign's stats
    """
    try:
        campaign = get_object_or_404(Campaign, pk=campaign_id)
        opportunity_value = request.data.get('opportunity_value')

        if opportunity_value is None:
            return Response({
                'success': False,
                'message': 'opportunity_value is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            opportunity_value = float(opportunity_value)
            if opportunity_value < 0:
                return Response({
                    'success': False,
                    'message': 'Opportunity value must be non-negative'
                }, status=status.HTTP_400_BAD_REQUEST)
        except (ValueError, TypeError):
            return Response({
                'success': False,
                'message': 'Invalid opportunity value format'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Get or create campaign stats
        stats, created = CampaignStats.objects.get_or_create(
            campaign=campaign,
            defaults={
                'opportunity_value': opportunity_value,
                'total_leads': 0,
                'sequence_started_count': 0,
                'opened_count': 0,
                'clicked_count': 0,
                'replied_count': 0,
                'opportunities_count': 0,
                'conversions_count': 0
            }
        )

        if not created:
            stats.opportunity_value = opportunity_value
            stats.save(update_fields=['opportunity_value'])

        return Response({
            'success': True,
            'message': 'Opportunity value updated successfully',
            'campaign_id': campaign.id,
            'opportunity_value': float(stats.opportunity_value)
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Error updating opportunity value for campaign {campaign_id}: {str(e)}")
        return Response({
            'success': False,
            'message': f'Error updating opportunity value: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




@api_view(['POST'])
def refresh_campaign_daily_stats(request):
    """
    refresh_campaign_daily_stats
    """
    try:
        pk= request.data.get('campaign_id')
        campaign = get_object_or_404(Campaign, pk=pk)

        target_date = timezone.now().date()
        # Cache key for this campaign/day
        cache_key = f"refresh_campaign_daily_stats_{campaign.id}_{target_date}"

        if not cache.add(cache_key, True, CACHE_TIMEOUT_SECONDS):
            return Response({
                'success': True,
                'message': f'Stats calculation task is already running or was recently initiated for "{campaign.name}". Please check back later in 30 minutes.',
                'campaign_id': campaign.id,
                'campaign_name': campaign.name,
                'status_code': 'ALREADY_TRIGGERED'
            }, status=status.HTTP_200_OK)

        try:
            # Create/update campaign stats first
            inngest_client.send_sync(
                inngest.Event(
                    name="analytics/calculate_daily_stats",
                    data={
                        "campaign_id": campaign.id,
                        "target_date": None,
                        }
                )
            )

        except Exception as e:
            logger.error(f"Error calc daily stats, campaign id:{campaign.id}: {str(e)}")
            return Response({
                'success': False,
                'message': f'Error calc daily stats: {str(e)}',
                'campaign_id': campaign.id
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        return Response({
            'success': True,
            'message': f'calculated "{campaign.name}" daily stats successfully',
            'campaign_id': campaign.id,
            'campaign_name': campaign.name,
            #'task_id': task_result.id if hasattr(task_result, 'id') else None,
        }, status=status.HTTP_200_OK)


    except Exception as e:
        logger.error(f"Unexpected error {pk}: {str(e)}")
        return Response({
            'success': False,
            'message': f'Error: {str(e)}',
            'error_type': 'unexpected_error',
            'campaign_id': pk
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )





@api_view(['POST'])
def launch_inggest_test(request):
    pass


@api_view(['GET'])
@permission_classes([AllowAny])
def jwks_endpoint(request):
    """
    JWKS endpoint for MCP server to validate JWT tokens
    Returns the public key in JWKS format
    """
    try:
        private_key_pem = settings.SIMPLE_JWT.get('SIGNING_KEY', '')
        if not private_key_pem:
            return Response({
                'error': 'JWT signing key not configured'
            }, status=500)

        # Load the private key to extract public key
        try:
            private_key = load_pem_private_key(
                private_key_pem.encode('utf-8'),
                password=None,
            )
            public_key = private_key.public_key()
            
            # Serialize public key to PEM format
            public_key_pem = public_key.public_key_bytes(
                encoding=serialization.Encoding.PEM,
                format=serialization.PublicFormat.SubjectPublicKeyInfo
            )
            
            # Convert to base64url for JWKS
            public_key_der = public_key.public_key_bytes(
                encoding=serialization.Encoding.DER,
                format=serialization.PublicFormat.SubjectPublicKeyInfo
            )
            
            # For RSA keys, we need to extract n and e values
            from cryptography.hazmat.primitives.asymmetric import rsa
            if isinstance(public_key, rsa.RSAPublicKey):
                public_numbers = public_key.public_numbers()
                n = base64.urlsafe_b64encode(public_numbers.n.to_bytes((public_numbers.n.bit_length() + 7) // 8, 'big')).decode('utf-8').rstrip('=')
                e = base64.urlsafe_b64encode(public_numbers.e.to_bytes((public_numbers.e.bit_length() + 7) // 8, 'big')).decode('utf-8').rstrip('=')
                
                jwks = {
                    "keys": [
                        {
                            "kty": "RSA",
                            "use": "sig",
                            "alg": "RS256",
                            "kid": "cccrm-jwt-key",
                            "n": n,
                            "e": e
                        }
                    ]
                }
                
                return Response(jwks, content_type='application/json')
            else:
                return Response({
                    'error': 'Only RSA keys are supported for JWKS'
                }, status=500)
                
        except Exception as key_error:
            logger.error(f"Error processing JWT key: {str(key_error)}")
            return Response({
                'error': 'Invalid JWT signing key format'
            }, status=500)
            
    except Exception as e:
        logger.error(f"Error generating JWKS: {str(e)}")
        return Response({
            'error': 'Internal server error'
        }, status=500)


from django.shortcuts import redirect

@api_view(['GET'])
@permission_classes([AllowAny])
def mcp_google_login_start(request):
    """
    Step 1 of the MCP OAuth flow.
    Saves the MCP server's state in the session, then starts the allauth Google login flow.
    """
    auth_request_id = request.GET.get('auth_request_id')
    state = request.GET.get('state')

    if not auth_request_id or not state:
        logger.error("MCP Google login start failed: missing auth_request_id or state")
        # Redirect to an error page or show an error message
        return redirect(f"{settings.SITE_URL}/auth/error?error=missing_mcp_params")

    # Store the MCP context in the session
    request.session['mcp_auth_request_id'] = auth_request_id
    request.session['mcp_state'] = state
    
    logger.info(f"MCP OAuth flow started. Stored auth_request_id: {auth_request_id} in session.")

    # Redirect to the allauth google login page
    google_login_url = '/oauth/google/login/'
    return redirect(google_login_url)


def mcp_oauth2_callback(request):
    """
    MCP OAuth2 callback endpoint.
    Handles the callback from Google OAuth and redirects back to MCP server with user info.
    """
    from django.contrib.auth import get_user_model
    from urllib.parse import urlparse, parse_qs

    User = get_user_model()

    try:
        # Get callback parameters from the URL
        mcp_callback_params = request.GET.get('mcp_callback_params', '')

        if not mcp_callback_params:
            logger.error("No MCP callback parameters provided")
            return redirect(f"{settings.SITE_URL}/auth/error?error=missing_callback_params")

        # Parse the callback parameters
        try:
            # mcp_callback_params format: "auth_request_id=IrZ9FnVChvIoCoXpvAIQ8A&state=7vJu2JHZ6uBCob2044qbVA=="
            params = {}
            for param in mcp_callback_params.split('&'):
                if '=' in param:
                    key, value = param.split('=', 1)
                    params[key] = value

            auth_request_id = params.get('auth_request_id')
            state = params.get('state')

            if not auth_request_id:
                raise ValueError("Missing auth_request_id")

        except Exception as e:
            logger.error(f"Failed to parse MCP callback parameters: {e}")
            return redirect(f"{settings.SITE_URL}/auth/error?error=invalid_callback_params")

        # Check if user is authenticated (should be after Google OAuth)
        if not request.user.is_authenticated:
            logger.error("User not authenticated after OAuth callback")
            return redirect(f"{settings.SITE_URL}/auth/error?error=user_not_authenticated")

        user = request.user

        # Get MCP server URL from settings or environment
        mcp_server_url = getattr(settings, 'MCP_SERVER_URL', 'http://localhost:8001')

        # Build callback URL for MCP server
        callback_url = f"{mcp_server_url}/oauth2/callback"
        callback_url += f"?auth_request_id={auth_request_id}"
        callback_url += f"&state={state}"
        callback_url += f"&django_user_id={user.id}"
        callback_url += f"&django_user_email={user.email}"

        logger.info(f"Redirecting to MCP server callback: {callback_url}")

        # Redirect to MCP server callback
        return redirect(callback_url)

    except Exception as e:
        logger.error(f"MCP OAuth2 callback error: {e}")
        return redirect(f"{settings.SITE_URL}/auth/error?error=internal_error")


@api_view(['POST'])
@permission_classes([AllowAny])
def validate_token(request):
    """
    Alternative token validation endpoint for MCP server
    if JWT validation is not used directly
    """
    from rest_framework_simplejwt.tokens import AccessToken
    from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
    
    token = request.data.get('token')
    if not token:
        return Response({
            'valid': False,
            'error': 'Token is required'
        }, status=400)
    
    try:
        # Validate the token
        access_token = AccessToken(token)
        user_id = access_token.payload.get('user_id')
        
        # Get user details
        from clients.models import CustomUser
        try:
            user = CustomUser.objects.get(id=user_id)
            return Response({
                'valid': True,
                'user_id': user.id,
                'email': user.email,
                'username': user.username,
                'company_id': user.subscribed_company.id if user.subscribed_company else None
            })
        except CustomUser.DoesNotExist:
            return Response({
                'valid': False,
                'error': 'User not found'
            }, status=404)
            
    except (InvalidToken, TokenError) as e:
        return Response({
            'valid': False,
            'error': f'Invalid token: {str(e)}'
        }, status=401)
    except Exception as e:
        logger.error(f"Error validating token: {str(e)}")
        return Response({
            'valid': False,
            'error': 'Internal server error'
        }, status=500)


@api_view(['POST'])
@permission_classes([AllowAny])
def mcp_jwt_tokens(request):
    """
    Issue JWT tokens for MCP server authentication
    Called by MCP server after OAuth completion
    """
    # Diagnostic logging
    signing_key_present = bool(settings.SIMPLE_JWT.get('SIGNING_KEY'))
    logger.info(f"Attempting to issue MCP JWT. Signing key present: {signing_key_present}")

    try:
        user_id = request.data.get('user_id')
        email = request.data.get('email')

        if not user_id or not email:
            return Response({
                'error': 'user_id and email are required'
            }, status=400)

        # Get the user
        from clients.models import CustomUser
        try:
            user = CustomUser.objects.get(id=user_id, email=email)
        except CustomUser.DoesNotExist:
            return Response({
                'error': 'User not found or email mismatch'
            }, status=404)

        # Generate JWT tokens
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)

        # Add custom claims
        refresh.payload.update({
            'email': user.email,
            'username': user.username,
            'company_id': user.subscribed_company.id if user.subscribed_company else None,
        })

        access_token = refresh.access_token

        return Response({
            'access_token': str(access_token),
            'refresh_token': str(refresh),
            'token_type': 'Bearer',
            'expires_in': 3600,  # 1 hour
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'company_id': user.subscribed_company.id if user.subscribed_company else None
            }
        })

    except Exception as e:
        logger.error(f"Error issuing MCP JWT tokens: {str(e)}")
        return Response({
            'error': 'Internal server error'
        }, status=500)