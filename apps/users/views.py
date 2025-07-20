from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer

class CurrentUserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sync_settings(request):
    """Sync accessibility settings from frontend"""
    user = request.user
    settings = request.data.get('settings', {})
    
    # Update user's preferred settings
    user.preferred_settings = settings
    user.save()
    
    return Response({
        'message': 'Settings synced successfully',
        'settings': settings
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats(request):
    """Get user statistics"""
    user = request.user
    
    # Calculate stats (you can expand this)
    stats = {
        'total_sessions': 0,  # Implement based on analytics
        'settings_changes': 0,  # Implement based on analytics
        'accessibility_score': 85,  # Implement based on current settings
        'premium_features_used': 0,  # Implement based on usage
    }
    
    return Response(stats)
