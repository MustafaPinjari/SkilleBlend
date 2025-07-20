import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    
    # Accessibility-specific fields
    accessibility_needs = models.JSONField(default=dict, blank=True)
    preferred_settings = models.JSONField(default=dict, blank=True)
    is_premium = models.BooleanField(default=False)
    
    # Privacy settings
    allow_analytics = models.BooleanField(default=True)
    allow_ai_suggestions = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_active = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return self.email
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.email

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    disability_type = models.CharField(
        max_length=50,
        choices=[
            ('none', 'None'),
            ('visual', 'Visual Impairment'),
            ('hearing', 'Hearing Impairment'),
            ('motor', 'Motor Impairment'),
            ('cognitive', 'Cognitive Impairment'),
            ('multiple', 'Multiple Impairments'),
        ],
        default='none'
    )
    assistive_technology = models.JSONField(default=list, blank=True)
    preferred_theme = models.CharField(
        max_length=20,
        choices=[('light', 'Light'), ('dark', 'Dark'), ('auto', 'Auto')],
        default='auto'
    )
    preferred_language = models.CharField(max_length=10, default='en')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_profiles'
    
    def __str__(self):
        return f"{self.user.email} Profile"
