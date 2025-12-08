import sys
from django.core.management.base import BaseCommand, CommandError
from urllib.parse import urlparse

class Command(BaseCommand):
    help = 'Parses a PostgreSQL connection URL into separate environment variables.'

    def add_arguments(self, parser):
        parser.add_argument('url', type=str, help='The PostgreSQL connection URL.')

    def handle(self, *args, **options):
        url = options['url']

        try:
            # Use urlparse to break down the URL
            parsed = urlparse(url)

            if parsed.scheme not in ['postgres', 'postgresql']:
                raise CommandError("URL scheme must be 'postgres' or 'postgresql'.")

            # Extract components
            db_name = parsed.path.lstrip('/')
            db_user = parsed.username
            db_password = parsed.password
            db_host = parsed.hostname or 'localhost'
            db_port = parsed.port or 5432

            # Print in the desired format
            self.stdout.write(f"DB_NAME={db_name}")
            self.stdout.write(f"DB_USER={db_user}")
            self.stdout.write(f"DB_PASSWORD={db_password}")
            self.stdout.write(f"DB_HOST={db_host}")
            self.stdout.write(f"DB_PORT={db_port}")

        except Exception as e:
            raise CommandError(f"Error parsing URL: {e}")
