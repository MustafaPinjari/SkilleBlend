from rest_framework import serializers
from .models import AccessibilitySettings, AccessibilityPreset, WebsiteAnalysis

class AccessibilitySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessibilitySettings
        fields = [
            'id', 'contrast_level', 'text_size', 'line_height', 'letter_spacing',
            'highlight_links', 'dark_mode', 'color_blindness_filter',
            'dyslexia_font', 'pause_animations', 'hide_images', 'reading_mode',
            'cursor_size', 'voice_control', 'ai_suggestions', 'keyboard_navigation',
            'version', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'version', 'created_at', 'updated_at']

class AccessibilityPresetSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessibilityPreset
        fields = [
            'id', 'name', 'description', 'preset_type', 'settings',
            'is_system', 'usage_count', 'created_at'
        ]
        read_only_fields = ['id', 'usage_count', 'created_at']

class WebsiteAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = WebsiteAnalysis
        fields = [
            'id', 'url', 'domain', 'overall_score', 'contrast_score',
            'structure_score', 'navigation_score', 'content_score',
            'issues', 'analysis_date'
        ]
        read_only_fields = ['id', 'analysis_date']
