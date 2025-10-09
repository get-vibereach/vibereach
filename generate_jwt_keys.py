#!/usr/bin/env python3
"""
Generate RSA key pair for JWT signing in Django + MCP integration
Run this script to generate the private and public keys needed for JWT authentication.
"""

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
import os

def generate_rsa_key_pair():
    """Generate RSA private and public key pair"""
    
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
        encryption_algorithm=serialization.NoEncryption()
    ).decode('utf-8')
    
    # Serialize public key
    public_key_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    ).decode('utf-8')
    
    return private_key_pem, public_key_pem

def save_keys_to_file():
    """Generate and save keys to files"""
    private_key_pem, public_key_pem = generate_rsa_key_pair()
    
    # Save to files
    with open('jwt_private_key.pem', 'w') as f:
        f.write(private_key_pem)
    
    with open('jwt_public_key.pem', 'w') as f:
        f.write(public_key_pem)
    
    print("✅ RSA key pair generated successfully!")
    print("\n📁 Files created:")
    print("  - jwt_private_key.pem (keep this secret!)")
    print("  - jwt_public_key.pem")
    
    print("\n🔧 Add these to your environment variables:")
    print("\n# In your .env file or environment:")
    print("JWT_PRIVATE_KEY='{}'".format(private_key_pem.replace('\n', '\\n')))
    print("JWT_PUBLIC_KEY='{}'".format(public_key_pem.replace('\n', '\\n')))
    print("JWT_AUDIENCE=cccrm-api")
    print("JWT_ISSUER=cccrm-backend")
    
    print("\n⚠️  Security Notes:")
    print("  - Keep the private key SECRET and secure")
    print("  - The public key can be shared (it's exposed via JWKS endpoint)")
    print("  - In production, use proper secrets management")
    print("  - Consider key rotation policies")

if __name__ == "__main__":
    print("🔐 Generating RSA key pair for JWT authentication...")
    print("=" * 60)
    save_keys_to_file()
    print("=" * 60)
    print("✨ Setup complete! Don't forget to update your environment variables.")