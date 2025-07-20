from django.contrib import admin
from .models import AccessibilitySettings, AccessibilityPreset, WebsiteAnalysis

@admin.register(AccessibilitySettings)
class AccessibilitySettingsAdmin(admin.ModelAdmin):
    list_display = ['user', 'version', 'dark_mode', 'text_size', 'contrast_level', 'updated_at']
    list_filter = ['dark_mode', 'dyslexia_font', 'reading_mode', 'created_at']
    search_fields = ['user__email']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(AccessibilityPreset)
class AccessibilityPresetAdmin(admin.ModelAdmin):
    list_display = ['name', 'preset_type', 'is_system', 'usage_count', 'created_at']
    list_filter = ['preset_type', 'is_system', 'created_at']
    search_fields = ['name', 'description']

@admin.register(WebsiteAnalysis)
class WebsiteAnalysisAdmin(admin.ModelAdmin):
    list_display = ['domain', 'overall_score', 'analyzed_by', 'analysis_date']
    list_filter = ['overall_score', 'analysis_date']
    search_fields = ['url', 'domain']
    readonly_fields = ['analysis_date']
