#!/bin/bash

echo "🚀 Setting up Accessibility Backend..."

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
echo "📝 Please edit .env file with your configuration"

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser
echo "Creating superuser..."
python manage.py createsuperuser

# Populate initial data
python manage.py populate_presets

echo "✅ Setup complete!"
echo "Run 'python manage.py runserver' to start the development server"
