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
