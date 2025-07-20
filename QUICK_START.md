# 🚀 Quick Start Guide

## Step 1: Check Python Installation

Open Command Prompt and run:
\`\`\`cmd
python --version
\`\`\`

If you get an error, install Python from https://python.org (make sure to check "Add Python to PATH")

## Step 2: Set Up the Project

### Option A: Automated Setup (Recommended)
\`\`\`cmd
# Run the setup script
setup.bat
\`\`\`

### Option B: Manual Setup
\`\`\`cmd
# 1. Create virtual environment
python -m venv venv

# 2. Activate virtual environment  
venv\Scripts\activate

# 3. Install packages
pip install Django==4.2.7
pip install djangorestframework==3.14.0
pip install django-cors-headers==4.3.1
pip install django-allauth==0.57.0
pip install dj-rest-auth==5.0.2
pip install python-decouple==3.8
pip install requests==2.31.0
pip install Pillow==10.1.0
pip install django-extensions==3.2.3
pip install whitenoise==6.6.0

# 4. Create .env file (copy the content from .env.example above)
notepad .env

# 5. Run migrations
python manage.py makemigrations
python manage.py migrate

# 6. Create superuser
python manage.py createsuperuser
\`\`\`

## Step 3: Start the Server

\`\`\`cmd
# Make sure virtual environment is active (you should see (venv) in prompt)
venv\Scripts\activate

# Start the server
python manage.py runserver
\`\`\`

## Step 4: Test the Setup

Open your browser and visit:
- http://localhost:8000/api/health/ (should show "healthy")
- http://localhost:8000/admin/ (Django admin panel)

## Troubleshooting

### "Python is not recognized"
- Reinstall Python from python.org
- Check "Add Python to PATH" during installation

### "No module named 'apps'"
- Make sure you're in the correct directory
- Make sure virtual environment is activated

### Database errors
- The setup uses SQLite by default (no additional setup needed)
- Check that migrations ran successfully

## File Structure

After setup, you should have:
\`\`\`
accessibility-backend/
├── venv/                    # Virtual environment
├── accessibility_backend/   # Django settings
├── apps/                   # Django apps
├── .env                    # Environment variables
├── db.sqlite3             # SQLite database
├── manage.py              # Django management
└── setup.bat              # Setup script
\`\`\`

## Next Steps

1. **Connect to Frontend**: Update your frontend `.env.local`:
   \`\`\`
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   \`\`\`

2. **Test API Endpoints**: Use the test page at `/test` in your frontend

3. **Customize Settings**: Edit `.env` file for your needs

Happy coding! 🎉
\`\`\`

Let me also create a minimal Django settings file that works with SQLite:

```python file="accessibility_backend/settings_simple.py"
"""
Simplified Django settings for development with SQLite
"""
import os
from pathlib import Path
from decouple import config

BASE_DIR = Path(__file__).resolve().parent.parent

# Security
SECRET_KEY = config('SECRET_KEY', default='django-insecure-change-me-in-production-12345')
DEBUG = config('DEBUG', default=True, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost,127.0.0.1', cast=lambda v: [s.strip() for s in v.split(',')])

# Applications
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    
    # Third party
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'dj_rest_auth',
    'dj_rest_auth.registration',
    
    # Local apps
    'apps.users',
    'apps.accessibility',
    'apps.ai_engine',
    'apps.analytics',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'accessibility_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'accessibility_backend.wsgi.application'

# Database - SQLite for simplicity
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Custom User Model
AUTH_USER_MODEL = 'users.User'

# Django REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

# CORS settings
CORS_ALLOWED_ORIGINS = config(
    'CORS_ALLOWED_ORIGINS',
    default='http://localhost:3000,http://127.0.0.1:3000',
    cast=lambda v: [s.strip() for s in v.split(',')]
)
CORS_ALLOW_CREDENTIALS = True

# Django Allauth
SITE_ID = 1
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_VERIFICATION = 'optional'

# dj-rest-auth
REST_AUTH_REGISTER_SERIALIZERS = {
    'REGISTER_SERIALIZER': 'apps.users.serializers.CustomRegisterSerializer',
}

# Cache (dummy for development)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    }
}

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}

# Create logs directory
os.makedirs(BASE_DIR / 'logs', exist_ok=True)
