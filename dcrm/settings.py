from pathlib import Path
from environ import Env
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Initialize environment variables
env = Env()

# Explicitly load .env **only in development**
if os.environ.get("DJANGO_DEBUG", "False") == "True":
    env.read_env(os.path.join(BASE_DIR, '.env'))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool('DEBUG', default=False)

ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['inngest'])

CSRF_TRUSTED_ORIGINS = env.list('CSRF_TRUSTED_ORIGINS', default=['http://inngest'])

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'allauth',
    'allauth.account',

    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',

    'rest_framework',
    'import_export',
    'django_htmx',
    'mathfilters',
    'pytracking',
    'admin_honeypot',
    'clients',
    'api',
    'campaign',
    'support',
    'feedback',
]


AUTH_USER_MODEL = 'clients.CustomUser'

# Authentication settings
LOGIN_URL = '/oauth/login/'
LOGOUT_REDIRECT_URL = '/'


# Django Allauth Config
LOGIN_REDIRECT_URL = "/account-settings/"
ACCOUNT_LOGIN_METHODS = {"username", "email"}
SOCIALACCOUNT_LOGIN_ON_GET = True
# ACCOUNT_EMAIL_VERIFICATION = "mandatory"
# ACCOUNT_EMAIL_SUBJECT_PREFIX = "[CFE] "
# ACCOUNT_SIGNUP_FIELDS = ["email*", "username*", "password1*", "password2*"]


AUTHENTICATION_BACKENDS = [
    # Needed to login by username in Django admin, regardless of `allauth`
    'django.contrib.auth.backends.ModelBackend',

    # `allauth` specific authentication methods, such as login by email
    'allauth.account.auth_backends.AuthenticationBackend',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    
    'allauth.account.middleware.AccountMiddleware',

    'dcrm.middleware.CustomLoginRequiredMiddleware',
    'dcrm.middleware.RequestMiddleware',
    'dcrm.middleware.ViewOnlyMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django_htmx.middleware.HtmxMiddleware',
]


SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        },
        'OAUTH_PKCE_ENABLED': True,
    }
}

ROOT_URLCONF = 'dcrm.urls'

OPEN_URLS = [
    r"^/api/inngest",
    r"^/campaign/tracking/.*$",
    r"^/admin/.*$",
]


VIEW_ONLY_EXEMPT_URLS = [
    r"^/feedback/api/quick-feedback/.*$",
    r"^/feedback/api/main-feedback/.*$",
    r"^/feedback/api/feature-request/.*$",
    r"^/support/api/messages/.*$",
    r"^/support/api/sessions/.*$",
    r"^/support/webhook/telegram/.*$",
]


TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'dcrm.context_processors.subscription_status',
            ],
        },
    },
]

WSGI_APPLICATION = 'dcrm.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases


if DEBUG:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'mydb',
            'USER': 'myuser',
            'PASSWORD': 'mypassword',
            'HOST': 'localhost',
            'PORT': '5432',
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': env('DB_NAME'),
            'USER': env('DB_USER'),
            'PASSWORD': env('DB_PASSWORD'),
            'HOST': env('DB_HOST'),
            'PORT': env('DB_PORT'),
            'OPTIONS': {
                'connect_timeout': 10,
            }
        }
    }



if DEBUG:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
            "LOCATION": "unique-snowflake",
        }
    }
else:
    CACHES = {
        "default": {
            "BACKEND": "django_redis.cache.RedisCache",
            "LOCATION": env('REDIS_URL_CACHE', default='redis://redis:6379/1'),
            "OPTIONS": {
                "CLIENT_CLASS": "django_redis.client.DefaultClient",
            }
        }
    }


REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '10/minute', # for nine authinticated users
        'user': '1000/day'
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Damascus'

USE_I18N = True

USE_TZ = True
  

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = 'static/'

STATICFILES_DIRS= ['static/']

# Add this line:
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')


MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Add logging configuration
# Ensure logs directory exists
import os
LOGS_DIR = os.path.join(BASE_DIR, 'logs')
if not os.path.exists(LOGS_DIR):
    os.makedirs(LOGS_DIR)

    
# Add logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            # Update the format to include user information
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message} [User: {user_username} ({user_email})]',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message} [User: {user_username}]',
            'style': '{',
        },
    },
    'filters': {
        'user_filter': {
            '()': 'dcrm.logging_filters.UserFilter',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
            'filters': ['user_filter'],
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(BASE_DIR, 'logs', f'django_{env("APP_COLOR")}.log'),
            'maxBytes': 1024*1024*20,  # Increased to 20MB
            'backupCount': 10,        # Increased to keep more backups
            'formatter': 'verbose',
            'filters': ['user_filter'],
        },
    },
    'loggers': {
        'campaign': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': True,
        },
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
        'django.request': {
            'handlers': ['console', 'file'],
            'level': 'ERROR',
            'propagate': False,
        },
        'django.server': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': 'INFO',
    },
}
if not DEBUG:
    # In production, we might want to add additional handlers or adjust levels
    pass


SITE_URL = env('SITE_URL', default='http://localhost:8000')


# PyTracking configuration
PYTRACKING_CONFIGURATION = {
    "base_open_tracking_url": f"{SITE_URL}/campaign/tracking/open/",
    "base_click_tracking_url": f"{SITE_URL}/campaign/tracking/click/",
    "append_slash": False
}



# Security settings - different for development vs production
if DEBUG:
    # Development settings
    CSRF_COOKIE_SECURE = False
    SESSION_COOKIE_SECURE = False
    SECURE_SSL_REDIRECT = False
else:
    # Production settings
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_SSL_REDIRECT = False
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SECURE = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')


# These can be always on
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SAMESITE = 'Lax'





# Telegram Bot Settings
TELEGRAM_BOT_TOKEN = env('TELEGRAM_BOT_TOKEN', default=None)
TELEGRAM_SUPPORT_CHAT_ID = env('TELEGRAM_SUPPORT_CHAT_ID', default=None)
TELEGRAM_WEBHOOK_API_KEY = env('TELEGRAM_WEBHOOK_API_KEY', default='your-secret-key-change-this')
DJANGO_API_URL = SITE_URL


# # Email settings for Zoho Mail
EMAIL_BACKEND = env('EMAIL_BACKEND')
EMAIL_HOST = env('EMAIL_HOST')
EMAIL_PORT = env.int('EMAIL_PORT')
EMAIL_USE_TLS = env.bool('EMAIL_USE_TLS')
EMAIL_USE_SSL = env.bool('EMAIL_USE_SSL')
EMAIL_HOST_USER = env('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL')

ADMIN_TO_NOTIFY_NAME = env('ADMIN_TO_NOTIFY_NAME')
ADMIN_TO_NOTIFY_EMAIL_ADDRESS = env('ADMIN_TO_NOTIFY_EMAIL_ADDRESS')

# # Email and AI rate limits
# EMAIL_RATE_LIMIT_PER_DAY = env.int('EMAIL_RATE_LIMIT_PER_DAY', 50)
# AI_RATE_LIMIT_PER_MINUTE = env.int('AI_RATE_LIMIT_PER_MINUTE', 0)
