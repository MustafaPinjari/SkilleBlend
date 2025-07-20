import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class UsageSession(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='usage_sessions')
    
    # Session details
    domain = models.CharField(max_length=255)
    url = models.URLField()
    duration = models.IntegerField(default=0)  # in seconds
    features_used = models.JSONField(default=list)
    
    # Timestamps
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'usage_sessions'
        ordering = ['-started_at']

class FeatureUsage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feature_usage')
    
    # Feature details
    feature_name = models.CharField(max_length=100)
    domain = models.CharField(max_length=255)
    url = models.URLField()
    
    # Usage context
    previous_value = models.JSONField(null=True, blank=True)
    new_value = models.JSONField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'feature_usage'
        ordering = ['-created_at']

class GlobalStats(models.Model):
    date = models.DateField(unique=True)
    
    # User metrics
    total_active_users = models.IntegerField(default=0)
    new_users = models.IntegerField(default=0)
    premium_users = models.IntegerField(default=0)
    
    # Usage metrics
    total_sessions = models.IntegerField(default=0)
    avg_session_duration = models.FloatField(default=0.0)
    
    # Accessibility metrics
    avg_accessibility_score = models.FloatField(default=0.0)
    ai_suggestions_generated = models.IntegerField(default=0)
    ai_suggestions_applied = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'global_stats'
        ordering = ['-date']
