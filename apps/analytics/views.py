from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Avg
from django.utils import timezone
from datetime import timedelta

from .models import UsageSession, FeatureUsage, GlobalStats

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_dashboard(request):
    """Get user's analytics dashboard"""
    user = request.user
    
    # Calculate user stats
    total_sessions = UsageSession.objects.filter(user=user).count()
    
    # Most used features
    most_used_features = (
        FeatureUsage.objects.filter(user=user)
        .values('feature_name')
        .annotate(count=Count('feature_name'))
        .order_by('-count')[:5]
    )
    
    # Recent activity
    recent_activity = (
        UsageSession.objects.filter(user=user)
        .order_by('-started_at')[:10]
        .values('domain', 'features_used', 'duration', 'started_at')
    )
    
    # Calculate improvement (simplified)
    accessibility_improvement = 15.5  # This would be calculated based on actual usage
    
    return Response({
        'total_sessions': total_sessions,
        'total_time_saved': total_sessions * 60,  # Estimated time saved
        'most_used_features': list(most_used_features),
        'accessibility_improvement': accessibility_improvement,
        'recent_activity': list(recent_activity)
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def track_usage(request):
    """Track feature usage"""
    user = request.user
    feature_name = request.data.get('feature_name')
    domain = request.data.get('domain', '')
    url = request.data.get('url', '')
    
    if not feature_name:
        return Response({'error': 'feature_name is required'}, status=400)
    
    # Create usage record
    FeatureUsage.objects.create(
        user=user,
        feature_name=feature_name,
        domain=domain,
        url=url
    )
    
    return Response({'message': 'Usage tracked successfully'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def global_stats(request):
    """Get global statistics (admin only)"""
    if not request.user.is_staff:
        return Response({'error': 'Admin access required'}, status=403)
    
    # Get latest stats
    latest_stats = GlobalStats.objects.first()
    
    if not latest_stats:
        # Generate sample stats
        latest_stats = {
            'date': timezone.now().date(),
            'total_active_users': 10000,
            'new_users': 150,
            'premium_users': 2500,
            'total_sessions': 50000,
            'avg_session_duration': 420,
            'avg_accessibility_score': 82.5,
            'ai_suggestions_generated': 5000,
            'ai_suggestions_applied': 3500
        }
    else:
        latest_stats = {
            'date': latest_stats.date,
            'total_active_users': latest_stats.total_active_users,
            'new_users': latest_stats.new_users,
            'premium_users': latest_stats.premium_users,
            'total_sessions': latest_stats.total_sessions,
            'avg_session_duration': latest_stats.avg_session_duration,
            'avg_accessibility_score': latest_stats.avg_accessibility_score,
            'ai_suggestions_generated': latest_stats.ai_suggestions_generated,
            'ai_suggestions_applied': latest_stats.ai_suggestions_applied
        }
    
    return Response(latest_stats)
