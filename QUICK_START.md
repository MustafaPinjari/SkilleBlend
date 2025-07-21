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

