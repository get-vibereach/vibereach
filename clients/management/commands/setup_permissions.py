from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from campaign.models import Campaign, Lead, Message, Product, LeadList, Schedule, CampaignOptions
from clients.models import EmailAccount, SubscribedCompany

class Command(BaseCommand):
    help = 'Creates a View Only group and assigns view permissions.'

    def handle(self, *args, **options):
        view_only_group, created = Group.objects.get_or_create(name='View Only')
        if created:
            self.stdout.write(self.style.SUCCESS('Successfully created "View Only" group.'))
        else:
            self.stdout.write(self.style.WARNING('"View Only" group already exists.'))

        # Clear existing permissions to avoid duplicates
        view_only_group.permissions.clear()

        # List of models to make view-only
        models = [
            Campaign, Lead, Message, Product, LeadList, Schedule, CampaignOptions,
            EmailAccount, SubscribedCompany
        ]

        view_permissions = []
        for model in models:
            content_type = ContentType.objects.get_for_model(model)
            permissions = Permission.objects.filter(
                content_type=content_type,
                codename__startswith='view_'
            )
            view_permissions.extend(permissions)

        view_only_group.permissions.set(view_permissions)
        self.stdout.write(self.style.SUCCESS(f'Assigned {len(view_permissions)} view permissions to "View Only" group.'))
