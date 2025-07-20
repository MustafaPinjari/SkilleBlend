from rest_framework import serializers
from .models import AISuggestion

class AISuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AISuggestion
        fields = [
            'id', 'title', 'description', 'suggestion_type', 'domain', 'url',
            'confidence_score', 'priority', 'is_applied', 'is_dismissed',
            'created_at', 'applied_at'
        ]
        read_only_fields = ['id', 'created_at', 'applied_at']
