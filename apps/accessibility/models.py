import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class AccessibilitySettings(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='accessibility_settings')
    
    # Visual adjustments
    contrast_level = models.IntegerField(default=100)
    text_size = models.FloatField(default=1.0)
    line_height = models.FloatField(default=1.5)
    letter_spacing = models.FloatField(default=0.0)
    highlight_links = models.BooleanField(default=False)
    
    # Color and theme
    dark_mode = models.BooleanField(default=False)
    color_blindness_filter = models.CharField(
        max_length=20,
        choices=[
            ('none', 'None'),
            ('protanopia', 'Protanopia'),
            ('deuteranopia', 'Deuteranopia'),
            ('tritanopia', 'Tritanopia'),
        ],
        default='none'
    )
    
    # Behavior controls
    dyslexia_font = models.BooleanField(default=False)
    pause_animations = models.BooleanField(default=False)
    hide_images = models.BooleanField(default=False)
    reading_mode = models.BooleanField(default=False)
    
    # Interface tools
    cursor_size = models.FloatField(default=1.0)
    voice_control = models.BooleanField(default=False)
    ai_suggestions = models.BooleanField(default=True)
    keyboard_navigation = models.BooleanField(default=False)
    
    # Metadata
    version = models.IntegerField(default=1)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'accessibility_settings'
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.user.email} - Settings v{self.version}"

class AccessibilityPreset(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField()
    preset_type = models.CharField(
        max_length=50,
        choices=[
            ('dyslexia', 'Dyslexia Support'),
            ('low_vision', 'Low Vision'),
            ('motor', 'Motor Impairment'),
            ('cognitive', 'Cognitive Support'),
            ('custom', 'Custom'),
        ]
    )
    
    # Settings as JSON
    settings = models.JSONField()
    
    # Metadata
    is_system = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    usage_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'accessibility_presets'
        ordering = ['name']
    
    def __str__(self):
        return self.name

class WebsiteAnalysis(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    url = models.URLField()
    domain = models.CharField(max_length=255)
    
    # Scores
    overall_score = models.IntegerField()
    contrast_score = models.IntegerField()
    structure_score = models.IntegerField()
    navigation_score = models.IntegerField()
    content_score = models.IntegerField()
    
    # Issues found
    issues = models.JSONField(default=list)
    
    # Analysis metadata
    analyzed_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    analysis_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'website_analyses'
        ordering = ['-analysis_date']
    
    def __str__(self):
        return f"{self.domain} - Score: {self.overall_score}"
