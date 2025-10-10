# Django Allauth + REST API Authentication for MCP Integration

## 🎯 Overview

This integration enables external MCP (Model Context Protocol) clients to authenticate and access Django APIs without affecting the existing browser-based authentication system. 

### Architecture

```mermaid
graph TB
    subgraph "Browser Clients"
        A[Web Browser] -->|Session + CSRF| B[Django Auth Views]
    end

    subgraph "MCP Clients"
        C[MCP Client] -->|OAuth2 Flow| D[FastAPI MCP Server]
        D -->|JWT Bearer Token| E[Django API]
    end

    subgraph "OAuth2 Flow"
        D -->|Redirect| F[Django Google OAuth]
        F -->|Callback| G[MCP OAuth2 Callback]
        G -->|User Info + JWT| D
    end

    subgraph "Django Backend"
        B --> H[Allauth + Session Auth]
        E --> I[DRF + JWT Auth]
        F --> H
        H --> J[User Database]
        I --> J
    end

    subgraph "Authentication Layer"
        K[/auth/ endpoints] -->|JWT Tokens| L[JWKS Public Key]
        D -->|Validate JWT| L
        M[/mcp/oauth2/callback/] -->|User Info| D
        N[/api/mcp/jwt/] -->|JWT Tokens| D
    end
```

### Key Features

✅ **Dual Authentication**: Session-based for browsers + JWT for MCP clients
✅ **Serverless OAuth Flow**: MCP clients authenticate via Google OAuth through Django
✅ **No Breaking Changes**: Existing authentication remains intact
✅ **Secure JWT**: RS256 signatures with JWKS endpoint
✅ **Google OAuth**: Works with existing Allauth setup
✅ **User Context**: MCP tools know which user is making requests
✅ **Rate Limiting**: Built-in API throttling

---

## 🚀 Setup Instructions

### 1. Django Backend Configuration

#### Install Dependencies
The required packages are already added to [`requirements.txt`](requirements.txt):
```
dj-rest-auth==7.0.1
djangorestframework-simplejwt==5.5.0  
cryptography==41.0.7
```

#### Generate RSA Keys
```bash
# Run the key generation script
python3 generate_jwt_keys.py

# This creates:
# - jwt_private_key.pem (keep secret!)
# - jwt_public_key.pem (shareable)
```

#### Environment Variables
Add to your `.env` file:
```env
# JWT Configuration
JWT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC...\n-----END PRIVATE KEY-----"
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr...\n-----END PUBLIC KEY-----"
JWT_AUDIENCE=cccrm-api
JWT_ISSUER=cccrm-backend
```

#### Database Migration
```bash
python manage.py migrate
```

### 2. FastAPI MCP Server Setup

#### Install MCP Server Dependencies
```bash
cd mcp-auth-test
pip install -r requirements.txt
```

#### Environment Configuration
```bash
export DJANGO_BASE_URL="http://localhost:8000"
# Server runs on port 10000 by default (configured in .env)
```

#### Run MCP Server
```bash
cd mcp-auth-test
python src/server.py
# OR
uvicorn src.server:app --host 0.0.0.0 --port 10000 --reload
```

**Note**: The MCP server runs on port **10000**, not 8001 as mentioned in some docs.

---

## 🔌 API Endpoints

### Django Authentication Endpoints

| Endpoint | Method | Purpose | Authentication |
|----------|--------|---------|---------------|
| `/auth/login/` | POST | Login with email/password | None |
| `/auth/logout/` | POST | Logout and blacklist tokens | JWT |
| `/auth/user/` | GET | Get user profile | JWT |
| `/auth/token/refresh/` | POST | Refresh access token | Refresh Token |
| `/api/.well-known/jwks.json` | GET | Get public keys for JWT validation | None |
| `/api/validate-token/` | POST | Validate JWT token | None |
| `/api/mcp/jwt/` | POST | Issue JWT tokens for MCP server | None |
| `/mcp/oauth2/callback/` | GET | MCP OAuth2 callback handler | Authenticated |

### MCP Server Endpoints  

| Endpoint | Method | Purpose | Authentication |
|----------|--------|---------|---------------|
| `/health` | GET | Health check | None |
| `/auth/verify` | GET | Test JWT authentication | JWT |
| `/mcp/tools/send-message` | POST | Send message via Django | JWT |
| `/mcp/tools/create-campaign` | POST | Create campaign | JWT |
| `/mcp/tools/get-campaigns` | GET | Get user campaigns | JWT |

---

## 🔄 MCP OAuth2 Flow

### Complete Authentication Flow

1. **MCP Client Requests Authentication**
   ```bash
   # MCP client initiates OAuth2 flow
   GET /oauth2/authorize?client_id=vscode_mcp_client&response_type=code&scope=openid profile email
   ```

2. **MCP Server Redirects to Django**
   ```bash
   # MCP server redirects to Django Google OAuth
   Location: http://localhost:8000/oauth/google/?next=http://localhost:8000/mcp/oauth2/callback/?mcp_callback_params=auth_request_id=IrZ9FnVChvIoCoXpvAIQ8A&state=7vJu2JHZ6uBCob2044qbVA==
   ```

3. **User Authenticates with Google**
   - User completes Google OAuth flow in browser
   - Django receives callback and authenticates user

4. **Django Redirects to MCP Callback**
   ```bash
   # Django redirects to MCP server with user info
   Location: http://localhost:8001/oauth2/callback?auth_request_id=IrZ9FnVChvIoCoXpvAIQ8A&state=7vJu2JHZ6uBCob2044qbVA==&django_user_id=1&django_user_email=user@example.com
   ```

5. **MCP Server Exchanges Code for JWT**
   ```bash
   # MCP server requests JWT tokens from Django
   POST /api/mcp/jwt/
   {
     "user_id": 1,
     "email": "user@example.com"
   }
   ```

6. **MCP Client Receives Authorization Code**
   ```bash
   # MCP server redirects client with authorization code
   Location: http://127.0.0.1:33418?code=abc123&state=xyz789
   ```

7. **MCP Client Exchanges Code for Tokens**
   ```bash
   # Client exchanges code for JWT tokens
   POST /oauth2/token
   {
     "grant_type": "authorization_code",
     "client_id": "vscode_mcp_client",
     "client_secret": "test_client_secret_123",
     "code": "abc123"
   }
   ```

### Environment Configuration

Add to your `.env` file:
```env
# MCP Server Configuration
MCP_SERVER_URL=http://localhost:8001
```

---

## 💻 Usage Examples

### 1. Authenticate with Django Backend

#### Option A: Email/Password Login
```bash
curl -X POST http://localhost:8000/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "your_password"
  }'
```

**Response:**
```json
{
  "access": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImNjY3JtLWp3dC1rZXkifQ...",
  "refresh": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImNjY3JtLWp3dC1rZXkifQ...",
  "user": {
    "pk": 1,
    "email": "user@example.com",
    "username": "user"
  }
}
```

#### Option B: Google OAuth Flow
```bash
# 1. Get Google OAuth URL
curl -X POST http://localhost:8000/auth/google/url/

# 2. User completes OAuth in browser
# 3. Exchange code for JWT tokens
curl -X POST http://localhost:8000/auth/google/ \
  -H "Content-Type: application/json" \
  -d '{
    "code": "GOOGLE_OAUTH_CODE",
    "redirect_uri": "http://localhost:3000/auth/callback"
  }'
```

### 2. Use JWT Token with MCP Server

#### Test Authentication
```bash
export JWT_TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIs..."

curl -X GET http://localhost:8001/auth/verify \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Response:**
```json
{
  "authenticated": true,
  "user": {
    "valid": true,
    "user_id": 1,
    "email": "user@example.com",
    "username": "user",
    "company_id": 5
  },
  "message": "Authentication successful"
}
```

#### Create Campaign via MCP
```bash
curl -X POST http://localhost:8001/mcp/tools/create-campaign \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Q1 Marketing Campaign",
    "description": "Email campaign for Q1 product launch"
  }'
```

#### Send Message via MCP
```bash
curl -X POST http://localhost:8001/mcp/tools/send-message \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "recipient_email": "lead@company.com",
    "subject": "Welcome to our service",
    "message": "Thank you for your interest..."
  }'
```

### 3. Token Refresh
```bash
curl -X POST http://localhost:8000/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIs..."
  }'
```

---

## 🔒 Security Considerations

### JWT Token Security
- **RS256 Algorithm**: Asymmetric signing prevents token forgery
- **Short Expiration**: Access tokens expire in 1 hour
- **Refresh Rotation**: Refresh tokens are rotated on use
- **Blacklisting**: Tokens are blacklisted on logout

### Key Management
- **Private Key**: Keep `JWT_PRIVATE_KEY` secret and secure
- **Public Key**: Exposed via JWKS endpoint for validation
- **Key Rotation**: Consider periodic key rotation in production

### Network Security
```bash
# Production recommendations:
# - Use HTTPS for all endpoints
# - Implement rate limiting
# - Use secure cookie settings
# - Configure proper CORS policies
```

### Environment Variables
```bash
# Production settings
DEBUG=False
CSRF_COOKIE_SECURE=True
SESSION_COOKIE_SECURE=True
SECURE_SSL_REDIRECT=True
```

---

## 🧪 Testing the Integration

### 1. Start Services
```bash
# Terminal 1: Django backend
python manage.py runserver 8000

# Terminal 2: MCP server (port 10000)
cd mcp-auth-test && python src/server.py
```

### 2. Configure VS Code MCP Client
Update your VS Code MCP configuration at `~/.config/Code/User/mcp.json`:
```json
{
  "servers": {
    "my-mcp-server": {
      "url": "http://127.0.0.1:10000/mcp/",
      "type": "http"
    }
  },
  "inputs": []
}
```

### 2. Test Authentication Flow
```bash
# 1. Login and get JWT token
TOKEN=$(curl -s -X POST http://localhost:8000/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  | python -c "import sys, json; print(json.load(sys.stdin)['access'])")

# 2. Test MCP server authentication
curl -X GET http://localhost:8001/auth/verify \
  -H "Authorization: Bearer $TOKEN"

# 3. Test MCP tool
curl -X GET http://localhost:8001/mcp/tools/get-campaigns \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Verify JWKS Endpoint
```bash
curl -X GET http://localhost:8000/api/.well-known/jwks.json
```

Expected response:
```json
{
  "keys": [
    {
      "kty": "RSA",
      "use": "sig", 
      "alg": "RS256",
      "kid": "cccrm-jwt-key",
      "n": "base64url_encoded_modulus",
      "e": "AQAB"
    }
  ]
}
```

---

## 🚨 Troubleshooting

### Common Issues

#### 1. "JWT signing key not configured"
```bash
# Ensure JWT_PRIVATE_KEY is set correctly
echo $JWT_PRIVATE_KEY

# Regenerate keys if needed
python3 generate_jwt_keys.py
```

#### 2. "Invalid token signature"
```bash
# Check if Django and MCP server are using same keys
curl http://localhost:8000/api/.well-known/jwks.json

# Verify token is properly formatted
echo $JWT_TOKEN | cut -d'.' -f2 | base64 -d
```

#### 3. "Authentication service unavailable" 
```bash
# Check Django server is running
curl http://localhost:8000/health

# Check network connectivity
curl http://localhost:8000/api/validate-token/
```

#### 4. CORS Issues
```javascript
// Frontend: Ensure credentials are included
fetch('/auth/login/', {
  method: 'POST',
  credentials: 'include',  // Important for CSRF
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCookie('csrftoken')
  },
  body: JSON.stringify({email, password})
})
```

#### 5. MCP OAuth Flow Issues

**"400 Bad Request" on /oauth2/authorize:**
```bash
# Check MCP server logs for client registration
# The MCP server auto-registers unknown clients in development mode
# If you see "Invalid client_id", restart the MCP server
```

**"MCP client not redirecting to Django":**
```bash
# Verify MCP client configuration points to correct port (10000)
curl http://localhost:10000/.well-known/oauth-authorization-server

# Check Django MCP callback endpoint
curl http://localhost:8000/mcp/oauth2/callback/
```

**"JWT tokens not issued":**
```bash
# Check Django MCP JWT endpoint
curl -X POST http://localhost:8000/api/mcp/jwt/ \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1, "email": "user@example.com"}'

# Verify RSA keys are generated
ls -la jwt_private_key.pem jwt_public_key.pem
```

### Debug Mode
```bash
# Django: Enable debug logging
export DJANGO_DEBUG=True
export DJANGO_LOG_LEVEL=DEBUG

# MCP Server: Enable verbose logging  
export LOG_LEVEL=DEBUG
```

---

## 📁 File Structure

```
cccrm/
├── dcrm/
│   ├── settings.py          # JWT & dj-rest-auth config
│   └── urls.py             # /auth/ endpoints
├── api/
│   ├── views.py            # JWKS & validation endpoints
│   └── urls.py             # API routes
├── mcp_server/
│   ├── main.py             # FastAPI MCP server
│   └── requirements.txt    # MCP dependencies
├── generate_jwt_keys.py    # RSA key generation script
└── requirements.txt        # Django dependencies
```

---

## 🔄 Migration Guide

### From Existing System
Your existing authentication system remains **completely unchanged**:
- Browser users continue using session authentication  
- All existing views and forms work as before
- No changes needed to current frontend code

### New MCP Integration
- MCP clients use `/auth/` endpoints for JWT tokens
- MCP server validates tokens via JWKS endpoint
- All MCP requests include `Authorization: Bearer <token>` header

---

## 📈 Next Steps

### Optional Enhancements
1. **OAuth2 Client Credentials**: Server-to-server authentication
2. **Token Scopes**: Granular permission control
3. **Rate Limiting**: Per-user API limits
4. **Audit Logging**: Track MCP tool usage
5. **Webhook Integration**: Real-time event notifications

### Production Deployment
1. **SSL/TLS**: Configure HTTPS certificates
2. **Load Balancing**: Scale MCP servers horizontally  
3. **Monitoring**: Add health checks and metrics
4. **Backup**: Secure key backup and rotation
5. **Documentation**: API documentation with OpenAPI/Swagger

---

## 📚 Additional Resources

- [Django REST Framework JWT](https://django-rest-framework-simplejwt.readthedocs.io/)
- [dj-rest-auth Documentation](https://dj-rest-auth.readthedocs.io/)
- [Django Allauth](https://django-allauth.readthedocs.io/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [JWT.io Debugger](https://jwt.io/)
- [JWKS Specification](https://tools.ietf.org/html/rfc7517)

---

## 🔧 Recent Updates

### v1.1 - Django Allauth Compatibility Fix
- **Fixed deprecation warnings** for Django Allauth settings
- **Updated configuration** to use modern `ACCOUNT_LOGIN_METHODS` and `ACCOUNT_SIGNUP_FIELDS`
- **Improved compatibility** with latest Django Allauth versions

#### Deprecated Configuration Fixed
The settings have been updated from deprecated format to current:
```python
# Old (deprecated)
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False

# New (current) - already applied in settings.py
ACCOUNT_LOGIN_METHODS = {'email'}
ACCOUNT_SIGNUP_FIELDS = ['email*', 'password1*', 'password2*']
```

This eliminates the following warnings:
- `settings.ACCOUNT_AUTHENTICATION_METHOD is deprecated`
- `settings.ACCOUNT_EMAIL_REQUIRED is deprecated`
- `settings.ACCOUNT_USERNAME_REQUIRED is deprecated`

---

## 🤝 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Django and MCP server logs
3. Verify environment variables are set correctly
4. Test with the provided curl examples

**Happy coding!** 🚀