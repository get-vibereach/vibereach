from import_export import resources
from .models import Lead

class LeadResource(resources.ModelResource):
   class Meta:
        model = Lead
        import_id_fields = ('email',)
        fields = (
            'lead_list',         
            'subscribed_company',
            'full_name',
            'first_name',
            'last_name',
            'full_arabic_name',
            'first_arabic_name',
            'last_arabic_name',
            'position',
            'email',
            'phone_number',
            'linkedin_profile',
            'company_name',
            'company_arabic_name',
            'company_website',
            'industry',
            'employee_count',
            'campany_linkedin_page',
            'location',
            'source',
            'lead_type',
            'created_at',
            'tags',
        )