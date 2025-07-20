@echo off
echo.
echo ========================================
echo   Accessibility Backend Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Python is not installed or not in PATH
    echo.
    echo Please install Python from: https://python.org
    echo Make sure to check "Add Python to PATH" during installation
    echo.
    pause
    exit /b 1
)

echo ✅ Python found
python --version

REM Create virtual environment
echo.
echo 📦 Creating virtual environment...
if exist venv (
    echo Virtual environment already exists
) else (
    python -m venv venv
    echo Virtual environment created
)

REM Activate virtual environment
echo.
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo.
echo ⬆️ Upgrading pip...
python -m pip install --upgrade pip

REM Install basic requirements first
echo.
echo 📚 Installing basic requirements...
pip install Django==4.2.7
pip install djangorestframework==3.14.0
pip install django-cors-headers==4.3.1
pip install django-allauth==0.57.0
pip install dj-rest-auth==5.0.2
pip install python-decouple==3.8
pip install requests==2.31.0
pip install Pillow==10.1.0
pip install django-extensions==3.2.3
pip install gunicorn==21.2.0
pip install whitenoise==6.6.0

REM Create .env file if it doesn't exist
echo.
echo 📝 Setting up environment file...
if not exist .env (
    if exist .env.example (
        copy .env.example .env
        echo .env file created from .env.example
    ) else (
        echo Creating .env file manually...
        (
            echo # Django Settings
            echo SECRET_KEY=django-insecure-change-me-in-production-12345
            echo DEBUG=True
            echo ALLOWED_HOSTS=localhost,127.0.0.1
            echo.
            echo # Database Configuration ^(SQLite for development^)
            echo # DB_NAME=accessibility_db
            echo # DB_USER=postgres  
            echo # DB_PASSWORD=root
            echo # DB_HOST=localhost
            echo # DB_PORT=5432
            echo.
            echo # CORS Settings
            echo CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
        ) > .env
        echo .env file created with basic settings
    )
) else (
    echo .env file already exists
)

REM Create necessary directories
echo.
echo 📁 Creating directories...
if not exist logs mkdir logs
if not exist media mkdir media
if not exist staticfiles mkdir staticfiles

REM Run Django setup
echo.
echo 🗄️ Setting up Django...

REM Make migrations for each app
echo Creating migrations...
python manage.py makemigrations users 2>nul
python manage.py makemigrations accessibility 2>nul  
python manage.py makemigrations ai_engine 2>nul
python manage.py makemigrations analytics 2>nul

REM Run migrations
echo Applying migrations...
python manage.py migrate

REM Collect static files
echo Collecting static files...
python manage.py collectstatic --noinput

REM Try to populate presets (might fail if command doesn't exist yet)
echo.
echo 🌱 Populating initial data...
python manage.py populate_presets 2>nul || echo "Preset population skipped (command not found)"

echo.
echo ========================================
echo   ✅ Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Create a superuser: python manage.py createsuperuser
echo 2. Start the server: python manage.py runserver
echo 3. Visit: http://localhost:8000/api/health/
echo.
echo To activate the virtual environment later:
echo   venv\Scripts\activate
echo.
pause
