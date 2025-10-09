#!/usr/bin/env python3
"""
FastAPI MCP Server with Django JWT Authentication Integration
Provides MCP tools with user authentication via JWT tokens from Django backend.
"""

from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
import httpx
import jwt
import logging
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import os
from contextlib import asynccontextmanager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
DJANGO_BASE_URL = os.getenv("DJANGO_BASE_URL", "http://localhost:8000")
JWKS_URL = f"{DJANGO_BASE_URL}/api/.well-known/jwks.json"
TOKEN_VALIDATION_URL = f"{DJANGO_BASE_URL}/api/validate-token/"

class JWTAuthenticator:
    """JWT Authentication handler for MCP server"""
    
    def __init__(self):
        self.public_keys = {}
        self.last_jwks_fetch = None
        self.jwks_cache_duration = timedelta(hours=1)
        
    async def get_jwks(self) -> Dict[str, Any]:
        """Fetch JWKS from Django backend"""
        now = datetime.utcnow()
        
        # Use cached keys if still valid
        if (self.last_jwks_fetch and 
            now - self.last_jwks_fetch < self.jwks_cache_duration and 
            self.public_keys):
            return self.public_keys
            
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(JWKS_URL, timeout=10.0)
                response.raise_for_status()
                jwks_data = response.json()
                
                # Cache the keys
                self.public_keys = {}
                for key_data in jwks_data.get("keys", []):
                    kid = key_data.get("kid", "default")
                    self.public_keys[kid] = key_data
                    
                self.last_jwks_fetch = now
                logger.info("JWKS updated from Django backend")
                return self.public_keys
                
        except Exception as e:
            logger.error(f"Failed to fetch JWKS: {e}")
            if self.public_keys:  # Use cached keys if fetch fails
                return self.public_keys
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to retrieve JWT public keys"
            )
    
    async def verify_token_with_django(self, token: str) -> Dict[str, Any]:
        """Fallback: verify token directly with Django backend"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    TOKEN_VALIDATION_URL,
                    json={"token": token},
                    timeout=10.0
                )
                
                if response.status_code == 200:
                    return response.json()
                else:
                    error_data = response.json()
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail=error_data.get("error", "Token validation failed")
                    )
                    
        except httpx.RequestError as e:
            logger.error(f"Django token validation request failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Authentication service unavailable"
            )
    
    async def verify_jwt_token(self, token: str) -> Dict[str, Any]:
        """Verify JWT token using JWKS"""
        try:
            # Decode header to get kid
            header = jwt.get_unverified_header(token)
            kid = header.get("kid", "cccrm-jwt-key")
            
            # Get public keys
            jwks = await self.get_jwks()
            key_data = jwks.get(kid)
            
            if not key_data:
                logger.warning(f"Key ID {kid} not found in JWKS")
                # Fallback to Django validation
                return await self.verify_token_with_django(token)
            
            # Convert JWKS key to RSA public key
            from jwt.algorithms import RSAAlgorithm
            public_key = RSAAlgorithm.from_jwk(key_data)
            
            # Verify and decode token
            payload = jwt.decode(
                token,
                public_key,
                algorithms=["RS256"],
                audience="cccrm-api",
                issuer="cccrm-backend"
            )
            
            return {
                "valid": True,
                "user_id": payload.get("user_id"),
                "email": payload.get("email"),
                "username": payload.get("username"),
                "company_id": payload.get("company_id"),
                "exp": payload.get("exp"),
                "iat": payload.get("iat")
            }
            
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired"
            )
        except jwt.InvalidTokenError as e:
            logger.warning(f"JWT validation failed: {e}")
            # Fallback to Django validation
            return await self.verify_token_with_django(token)
        except Exception as e:
            logger.error(f"Unexpected error during JWT verification: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Authentication error"
            )

# Initialize authenticator
jwt_auth = JWTAuthenticator()
security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> Dict[str, Any]:
    """Dependency to get current authenticated user"""
    token = credentials.credentials
    user_data = await jwt_auth.verify_jwt_token(token)
    
    if not user_data.get("valid"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    return user_data

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    logger.info("🚀 MCP Server starting up...")
    
    # Pre-fetch JWKS on startup
    try:
        await jwt_auth.get_jwks()
        logger.info("✅ JWKS loaded successfully")
    except Exception as e:
        logger.warning(f"⚠️  Failed to pre-load JWKS: {e}")
    
    yield
    
    logger.info("🛑 MCP Server shutting down...")

# Initialize FastAPI app
app = FastAPI(
    title="CCCRM MCP Server",
    description="Model Context Protocol server with Django JWT authentication",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[DJANGO_BASE_URL, "http://localhost:3000"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "django_backend": DJANGO_BASE_URL
    }

@app.get("/auth/verify")
async def verify_auth(user: Dict[str, Any] = Depends(get_current_user)):
    """Verify authentication endpoint for testing"""
    return {
        "authenticated": True,
        "user": user,
        "message": "Authentication successful"
    }

# MCP Tool endpoints
@app.post("/mcp/tools/send-message")
async def send_message_tool(
    request: Request,
    user: Dict[str, Any] = Depends(get_current_user)
):
    """MCP Tool: Send message via Django backend"""
    try:
        body = await request.json()
        
        # Extract parameters
        recipient_email = body.get("recipient_email")
        subject = body.get("subject")
        message = body.get("message")
        
        if not all([recipient_email, subject, message]):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="recipient_email, subject, and message are required"
            )
        
        # Make authenticated request to Django API
        # You'll need to implement the actual message sending logic
        # This is a placeholder that shows how to make authenticated requests
        
        async with httpx.AsyncClient() as client:
            # Example: Create a message assignment or send directly
            response = await client.post(
                f"{DJANGO_BASE_URL}/api/messages/",
                json={
                    "subject": subject,
                    "content": message,
                    # Add other required fields based on your Message model
                },
                headers={
                    "Authorization": f"Bearer {request.headers.get('authorization', '').replace('Bearer ', '')}"
                }
            )
            
            if response.status_code == 201:
                return {
                    "success": True,
                    "message": "Message sent successfully",
                    "data": response.json()
                }
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Failed to send message: {response.text}"
                )
                
    except Exception as e:
        logger.error(f"Error sending message: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@app.post("/mcp/tools/create-campaign")
async def create_campaign_tool(
    request: Request,
    user: Dict[str, Any] = Depends(get_current_user)
):
    """MCP Tool: Create campaign via Django backend"""
    try:
        body = await request.json()
        
        # Extract parameters
        campaign_name = body.get("name")
        description = body.get("description", "")
        
        if not campaign_name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="campaign name is required"
            )
        
        # Make authenticated request to Django API
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{DJANGO_BASE_URL}/api/campaigns/",
                json={
                    "name": campaign_name,
                    "description": description,
                    # Add other required fields based on your Campaign model
                },
                headers={
                    "Authorization": f"Bearer {request.headers.get('authorization', '').replace('Bearer ', '')}"
                }
            )
            
            if response.status_code == 201:
                return {
                    "success": True,
                    "message": "Campaign created successfully",
                    "data": response.json()
                }
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Failed to create campaign: {response.text}"
                )
                
    except Exception as e:
        logger.error(f"Error creating campaign: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@app.get("/mcp/tools/get-campaigns")
async def get_campaigns_tool(
    request: Request,
    user: Dict[str, Any] = Depends(get_current_user)
):
    """MCP Tool: Get user's campaigns from Django backend"""
    try:
        # Make authenticated request to Django API
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{DJANGO_BASE_URL}/api/campaigns/",
                headers={
                    "Authorization": f"Bearer {request.headers.get('authorization', '').replace('Bearer ', '')}"
                }
            )
            
            if response.status_code == 200:
                return {
                    "success": True,
                    "data": response.json(),
                    "user": user["user_id"]
                }
            else:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=f"Failed to retrieve campaigns: {response.text}"
                )
                
    except Exception as e:
        logger.error(f"Error retrieving campaigns: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8001,
        log_level="info"
    )