import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class AISuggestion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_suggestions')
    
    # Suggestion content
    title = models.CharField(max_length=200)
    description = models.TextField()
    suggestion_type = models.CharField(
        max_length=50,
        choices=[
            ('visual', 'Visual Adjustment'),
            ('behavior', 'Behavior Control'),
            ('interface', 'Interface Tool'),
            ('preset', 'Preset Recommendation'),
        ]
    )
    
    # Context
    domain = models.CharField(max_length=255, blank=True)
    url = models.URLField(blank=True)
    issues = models.JSONField(default=list)
    
    # AI metadata
    confidence_score = models.FloatField(default=0.0)
    priority = models.CharField(
        max_length=20,
        choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')],
        default='medium'
    )
    
    # User interaction
    is_applied = models.BooleanField(default=False)
    is_dismissed = models.BooleanField(default=False)
    user_feedback = models.TextField(blank=True)
    user_rating = models.IntegerField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    applied_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'ai_suggestions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.email}"
