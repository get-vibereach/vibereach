from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import (
	ProductSerializer, EmailAccountSerializer, CampaignSerializer,
	MessageSerializer, MessageAssignmentSerializer, LeadListSerializer,
	LeadSerializer, ScheduleSerializer, CampaignOptionsSerializer, CampaignStatsSerializer,
	CampaignDailyStatsSerializer
)
from clients.models import Product, EmailAccount
from campaign.models import Campaign, CampaignLead, CampaignOptions, CampaignStats, CampaignDailyStats, Lead, LeadList, Message, MessageAssignment, Schedule


# --- Child-by-parent views for core API ---
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404



# Mixin to filter by user's subscribed_company
class SubscribedCompanyQuerysetMixin:
	def get_queryset(self):
			model = self.queryset.model
			user_company = self.request.user.subscribed_company
			if model is Product:
				return self.queryset.filter(subscribed_company=user_company)
			if model is LeadList:
				return self.queryset.filter(subscribed_company=user_company)
			if model is Lead:
				return self.queryset.filter(subscribed_company=user_company)
			if model is Message:
				# Message is related to Product, which is related to SubscribedCompany
				return self.queryset.filter(product__subscribed_company=user_company)
			if model is Campaign:
				return self.queryset.filter(subscribed_company=user_company)
			if model is CampaignLead:
				# CampaignLead is related to Campaign, which is related to SubscribedCompany
				return self.queryset.filter(campaign__subscribed_company=user_company)
			if model is MessageAssignment:
				# MessageAssignment is related to Campaign, which is related to SubscribedCompany
				return self.queryset.filter(campaign__subscribed_company=user_company)
			if model is Schedule:
				# Schedule is related to Campaign, which is related to SubscribedCompany
				return self.queryset.filter(campaign__subscribed_company=user_company)
			if model is CampaignOptions:
				# CampaignOptions is related to Campaign, which is related to SubscribedCompany
				return self.queryset.filter(campaign__subscribed_company=user_company)
			if model is CampaignStats:
				# CampaignStats is related to Campaign, which is related to SubscribedCompany
				return self.queryset.filter(campaign__subscribed_company=user_company)
			if model is CampaignDailyStats:
				# CampaignDailyStats is related to Campaign, which is related to SubscribedCompany
				return self.queryset.filter(campaign__subscribed_company=user_company)
			if model is EmailAccount:
				return self.queryset.filter(subscribed_company=user_company)
			return self.queryset.none()

# Product Views
class ProductListCreateView(SubscribedCompanyQuerysetMixin, generics.ListCreateAPIView):
	queryset = Product.objects.all()
	serializer_class = ProductSerializer
	permission_classes = [IsAuthenticated]

class ProductRetrieveUpdateDestroyView(SubscribedCompanyQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
	queryset = Product.objects.all()
	serializer_class = ProductSerializer
	permission_classes = [IsAuthenticated]

# EmailAccount Views
class EmailAccountListCreateView(SubscribedCompanyQuerysetMixin, generics.ListCreateAPIView):
	queryset = EmailAccount.objects.all()
	serializer_class = EmailAccountSerializer
	permission_classes = [IsAuthenticated]

class EmailAccountRetrieveUpdateDestroyView(SubscribedCompanyQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
	queryset = EmailAccount.objects.all()
	serializer_class = EmailAccountSerializer
	permission_classes = [IsAuthenticated]

# Campaign Views
class CampaignListCreateView(SubscribedCompanyQuerysetMixin, generics.ListCreateAPIView):
	queryset = Campaign.objects.all()
	serializer_class = CampaignSerializer
	permission_classes = [IsAuthenticated]

class CampaignRetrieveUpdateDestroyView(SubscribedCompanyQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
	queryset = Campaign.objects.all()
	serializer_class = CampaignSerializer
	permission_classes = [IsAuthenticated]

# LeadList Views
class LeadListListCreateView(SubscribedCompanyQuerysetMixin, generics.ListCreateAPIView):
	queryset = LeadList.objects.all()
	serializer_class = LeadListSerializer
	permission_classes = [IsAuthenticated]

class LeadListRetrieveUpdateDestroyView(SubscribedCompanyQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
	queryset = LeadList.objects.all()
	serializer_class = LeadListSerializer
	permission_classes = [IsAuthenticated]

# Lead Views
class LeadListCreateView(SubscribedCompanyQuerysetMixin, generics.ListCreateAPIView):
	queryset = Lead.objects.all()
	serializer_class = LeadSerializer
	permission_classes = [IsAuthenticated]

class LeadRetrieveUpdateDestroyView(SubscribedCompanyQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
	queryset = Lead.objects.all()
	serializer_class = LeadSerializer
	permission_classes = [IsAuthenticated]

# Schedule Views
class ScheduleListCreateView(SubscribedCompanyQuerysetMixin, generics.ListCreateAPIView):
	queryset = Schedule.objects.all()
	serializer_class = ScheduleSerializer
	permission_classes = [IsAuthenticated]

class ScheduleRetrieveUpdateDestroyView(SubscribedCompanyQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
	queryset = Schedule.objects.all()
	serializer_class = ScheduleSerializer
	permission_classes = [IsAuthenticated]

# CampaignOptions Views
class CampaignOptionsListCreateView(SubscribedCompanyQuerysetMixin, generics.ListCreateAPIView):
	queryset = CampaignOptions.objects.all()
	serializer_class = CampaignOptionsSerializer
	permission_classes = [IsAuthenticated]

class CampaignOptionsRetrieveUpdateDestroyView(SubscribedCompanyQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
	queryset = CampaignOptions.objects.all()
	serializer_class = CampaignOptionsSerializer
	permission_classes = [IsAuthenticated]

# CampaignStats Views
class CampaignStatsListCreateView(SubscribedCompanyQuerysetMixin, generics.ListCreateAPIView):
	queryset = CampaignStats.objects.all()
	serializer_class = CampaignStatsSerializer
	permission_classes = [IsAuthenticated]

class CampaignStatsRetrieveUpdateDestroyView(SubscribedCompanyQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
	queryset = CampaignStats.objects.all()
	serializer_class = CampaignStatsSerializer
	permission_classes = [IsAuthenticated]
	

# CampaignDailyStats Views
class CampaignDailyStatsListCreateView(SubscribedCompanyQuerysetMixin, generics.ListCreateAPIView):
	queryset = CampaignDailyStats.objects.all()
	serializer_class = CampaignDailyStatsSerializer
	permission_classes = [IsAuthenticated]

class CampaignDailyStatsRetrieveUpdateDestroyView(SubscribedCompanyQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
	queryset = CampaignDailyStats.objects.all()
	serializer_class = CampaignDailyStatsSerializer
	permission_classes = [IsAuthenticated]


# Message Views
class MessageListCreateView(SubscribedCompanyQuerysetMixin, generics.ListCreateAPIView):
	queryset = Message.objects.all()
	serializer_class = MessageSerializer
	permission_classes = [IsAuthenticated]

class MessageRetrieveUpdateDestroyView(SubscribedCompanyQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
	queryset = Message.objects.all()
	serializer_class = MessageSerializer
	permission_classes = [IsAuthenticated]

# CampaignLead Views
class CampaignLeadListCreateView(SubscribedCompanyQuerysetMixin, generics.ListCreateAPIView):
	queryset = CampaignLead.objects.all()
	serializer_class = LeadSerializer  # You may want a dedicated CampaignLeadSerializer
	permission_classes = [IsAuthenticated]

class CampaignLeadRetrieveUpdateDestroyView(SubscribedCompanyQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
	queryset = CampaignLead.objects.all()
	serializer_class = LeadSerializer  # You may want a dedicated CampaignLeadSerializer
	permission_classes = [IsAuthenticated]

# MessageAssignment Views
class MessageAssignmentListCreateView(SubscribedCompanyQuerysetMixin, generics.ListCreateAPIView):
	queryset = MessageAssignment.objects.all()
	serializer_class = MessageAssignmentSerializer
	permission_classes = [IsAuthenticated]

class MessageAssignmentRetrieveUpdateDestroyView(SubscribedCompanyQuerysetMixin, generics.RetrieveUpdateDestroyAPIView):
	queryset = MessageAssignment.objects.all()
	serializer_class = MessageAssignmentSerializer
	permission_classes = [IsAuthenticated]









# Leads by LeadList
class LeadListLeadsView(APIView):
	permission_classes = [IsAuthenticated]
	def get(self, request, leadlist_id):
		leadlist = get_object_or_404(LeadList, id=leadlist_id, subscribed_company=request.user.subscribed_company)
		leads = Lead.objects.filter(lead_list=leadlist)
		serializer = LeadSerializer(leads, many=True)
		return Response(serializer.data)

# Campaigns by Product
class ProductCampaignsView(APIView):
	permission_classes = [IsAuthenticated]
	def get(self, request, product_id):
		product = get_object_or_404(Product, id=product_id, subscribed_company=request.user.subscribed_company)
		campaigns = Campaign.objects.filter(product=product)
		serializer = CampaignSerializer(campaigns, many=True)
		return Response(serializer.data)

# CampaignLeads by Campaign
class CampaignLeadsView(APIView):
	permission_classes = [IsAuthenticated]
	def get(self, request, campaign_id):
		campaign = get_object_or_404(Campaign, id=campaign_id, subscribed_company=request.user.subscribed_company)
		campaign_leads = CampaignLead.objects.filter(campaign=campaign)
		serializer = LeadSerializer([cl.lead for cl in campaign_leads], many=True)
		return Response(serializer.data)

# CampaignOptions by Campaign
class CampaignOptionsByCampaignView(APIView):
	permission_classes = [IsAuthenticated]
	def get(self, request, campaign_id):
		campaign = get_object_or_404(Campaign, id=campaign_id, subscribed_company=request.user.subscribed_company)
		options = CampaignOptions.objects.filter(campaign=campaign)
		serializer = CampaignOptionsSerializer(options, many=True)
		return Response(serializer.data)

# CampaignStats by Campaign
class CampaignStatsByCampaignView(APIView):
	permission_classes = [IsAuthenticated]
	def get(self, request, campaign_id):
		campaign = get_object_or_404(Campaign, id=campaign_id, subscribed_company=request.user.subscribed_company)
		stats = CampaignStats.objects.filter(campaign=campaign)
		serializer = CampaignStatsSerializer(stats, many=True)
		return Response(serializer.data)

# Schedule by Campaign
class ScheduleByCampaignView(APIView):
	permission_classes = [IsAuthenticated]
	def get(self, request, campaign_id):
		campaign = get_object_or_404(Campaign, id=campaign_id, subscribed_company=request.user.subscribed_company)
		schedules = Schedule.objects.filter(campaign=campaign)
		serializer = ScheduleSerializer(schedules, many=True)
		return Response(serializer.data)

# Messages by Campaign
class MessagesByCampaignView(APIView):
	permission_classes = [IsAuthenticated]
	def get(self, request, campaign_id):
		campaign = get_object_or_404(Campaign, id=campaign_id, subscribed_company=request.user.subscribed_company)
		messages = Message.objects.filter(product=campaign.product)
		serializer = MessageSerializer(messages, many=True)
		return Response(serializer.data)

# MessageAssignments by Campaign
class MessageAssignmentsByCampaignView(APIView):
	permission_classes = [IsAuthenticated]
	def get(self, request, campaign_id):
		campaign = get_object_or_404(Campaign, id=campaign_id, subscribed_company=request.user.subscribed_company)
		assignments = MessageAssignment.objects.filter(campaign=campaign)
		serializer = MessageAssignmentSerializer(assignments, many=True)
		return Response(serializer.data)

# MessageAssignments by Message
class MessageAssignmentsByMessageView(APIView):
	permission_classes = [IsAuthenticated]
	def get(self, request, message_id):
		message = get_object_or_404(Message, id=message_id)
		# Only allow if message.product belongs to user's company
		if message.product.subscribed_company != request.user.subscribed_company:
			return Response({'detail': 'Not found.'}, status=404)
		assignments = MessageAssignment.objects.filter(message=message)
		serializer = MessageAssignmentSerializer(assignments, many=True)
		return Response(serializer.data)