import os

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Generates an RSA key pair (private and public) for JWT signing."

    def generate_rsa_key_pair(self):
        """Generate RSA private and public key pair"""

        self.stdout.write("Generating 2048-bit RSA key pair...")

        # Generate private key
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048,
        )

        # Get public key
        public_key = private_key.public_key()

        # Serialize private key
        private_key_pem = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            # It's generally better to use NoEncryption for environment variables/config files,
            # but if you need password protection: serialization.BestAvailableEncryption(b'password')
            encryption_algorithm=serialization.NoEncryption(),
        ).decode("utf-8")

        # Serialize public key
        public_key_pem = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo,
        ).decode("utf-8")

        return private_key_pem, public_key_pem

    def save_keys_to_file(self, private_key_pem, public_key_pem):
        """Save keys to files"""

        private_filename = "jwt_private_key.pem"
        public_filename = "jwt_public_key.pem"

        # Save to files
        try:
            with open(private_filename, "w") as f:
                f.write(private_key_pem)

            with open(public_filename, "w") as f:
                f.write(public_key_pem)
        except IOError as e:
            raise CommandError(f"Could not write keys to file: {e}")

        return private_filename, public_filename

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.MIGRATE_HEADING(
                "🔐 Generating RSA key pair for JWT authentication..."
            )
        )
        self.stdout.write("=" * 60)

        try:
            private_key_pem, public_key_pem = self.generate_rsa_key_pair()
            private_filename, public_filename = self.save_keys_to_file(
                private_key_pem, public_key_pem
            )

            self.stdout.write(
                self.style.SUCCESS("\n✅ RSA key pair generated successfully!")
            )

            self.stdout.write("\n📁 Files created (in the current directory):")
            self.stdout.write(f"  - {private_filename} (keep this secret!)")
            self.stdout.write(f"  - {public_filename}")

            # Prepare keys for .env output (replacing newlines with \n)
            env_private_key = private_key_pem.replace("\n", "\\n")
            env_public_key = public_key_pem.replace("\n", "\\n")

            self.stdout.write(self.style.MIGRATE_HEADING("\n🔧 Configuration Setup:"))
            self.stdout.write(
                self.style.NOTICE(
                    "Copy and paste these lines into your .env file or production configuration:"
                )
            )

            self.stdout.write("\n# JWT Configuration")
            self.stdout.write(f"JWT_PRIVATE_KEY='{env_private_key}'")
            self.stdout.write(f"JWT_PUBLIC_KEY='{env_public_key}'")
            self.stdout.write("JWT_AUDIENCE=cccrm-api")
            self.stdout.write("JWT_ISSUER=cccrm-backend")

            self.stdout.write(self.style.WARNING("\n⚠️  Security Notes:"))
            self.stdout.write(
                "  - The private key is highly sensitive and should be kept secure."
            )
            self.stdout.write(
                "  - Use proper secrets management (e.g., AWS Secrets Manager, HashiCorp Vault) in production."
            )
            self.stdout.write("=" * 60)
            self.stdout.write(
                self.style.SUCCESS(
                    "✨ Setup complete! Don't forget to update your environment variables."
                )
            )

        except CommandError as e:
            self.stderr.write(self.style.ERROR(f"Error generating keys: {e}"))
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"An unexpected error occurred: {e}"))
