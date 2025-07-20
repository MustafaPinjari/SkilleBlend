from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import AISuggestion
from .serializers import AISuggestionSerializer
from .services import ai_service

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_suggestions(request):
    """Generate AI suggestions for the user"""
    user = request.user
    domain = request.data.get('domain', '')
    url = request.data.get('url', '')
    issues = request.data.get('issues', [])
    score = request.data.get('score')
    
    try:
        suggestions = ai_service.generate_suggestions(user, domain, url, issues, score)
        serializer = AISuggestionSerializer(suggestions, many=True)
        
        return Response({
            'suggestions': serializer.data,
            'count': len(suggestions)
        })
        
    except Exception as e:
        return Response(
            {'error': f'Failed to generate suggestions: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_suggestion(request, suggestion_id):
    """Apply an AI suggestion"""
    suggestion = get_object_or_404(AISuggestion, id=suggestion_id, user=request.user)
    
    # Mark as applied
    suggestion.is_applied = True
    suggestion.applied_at = timezone.now()
    suggestion.save()
    
    # Here you would apply the actual settings changes
    # This is a simplified version
    applied_settings = {}
    
    if suggestion.suggestion_type == 'visual':
        if 'contrast' in suggestion.title.lower():
            applied_settings['contrast_level'] = 150
        elif 'text' in suggestion.title.lower():
            applied_settings['text_size'] = 1.2
    
    return Response({
        'message': 'Suggestion applied successfully',
        'applied_settings': applied_settings
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def provide_feedback(request, suggestion_id):
    """Provide feedback on a suggestion"""
    suggestion = get_object_or_404(AISuggestion, id=suggestion_id, user=request.user)
    
    feedback = request.data.get('feedback', '')
    rating = request.data.get('rating')
    
    suggestion.user_feedback = feedback
    if rating is not None:
        suggestion.user_rating = rating
    suggestion.save()
    
    return Response({'message': 'Feedback recorded successfully'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_suggestions(request):
    """Get user's suggestions"""
    suggestions = AISuggestion.objects.filter(
        user=request.user,
        is_dismissed=False
    )[:10]
    
    serializer = AISuggestionSerializer(suggestions, many=True)
    return Response(serializer.data)
