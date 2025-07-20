from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from urllib.parse import urlparse
import requests
from bs4 import BeautifulSoup

from .models import AccessibilitySettings, AccessibilityPreset, WebsiteAnalysis
from .serializers import AccessibilitySettingsSerializer, AccessibilityPresetSerializer, WebsiteAnalysisSerializer

class AccessibilitySettingsView(generics.RetrieveUpdateAPIView):
    serializer_class = AccessibilitySettingsSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        settings, created = AccessibilitySettings.objects.get_or_create(
            user=self.request.user,
            is_active=True,
            defaults={'version': 1}
        )
        return settings

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bulk_update_settings(request):
    """Bulk update accessibility settings"""
    user = request.user
    settings_data = request.data
    
    # Get or create current settings
    settings, created = AccessibilitySettings.objects.get_or_create(
        user=user,
        is_active=True,
        defaults={'version': 1}
    )
    
    # Update fields
    for field, value in settings_data.items():
        if hasattr(settings, field):
            setattr(settings, field, value)
    
    settings.version += 1
    settings.save()
    
    serializer = AccessibilitySettingsSerializer(settings)
    return Response(serializer.data)

class AccessibilityPresetListView(generics.ListCreateAPIView):
    serializer_class = AccessibilityPresetSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return AccessibilityPreset.objects.filter(
            models.Q(is_system=True) | models.Q(created_by=self.request.user)
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_preset(request, preset_id):
    """Apply a preset to user's settings"""
    preset = get_object_or_404(AccessibilityPreset, id=preset_id)
    user = request.user
    
    # Get or create current settings
    settings, created = AccessibilitySettings.objects.get_or_create(
        user=user,
        is_active=True,
        defaults={'version': 1}
    )
    
    # Apply preset settings
    for field, value in preset.settings.items():
        if hasattr(settings, field):
            setattr(settings, field, value)
    
    settings.version += 1
    settings.save()
    
    # Increment usage count
    preset.usage_count += 1
    preset.save()
    
    serializer = AccessibilitySettingsSerializer(settings)
    return Response({
        'message': f'Preset "{preset.name}" applied successfully',
        'settings': serializer.data
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_website(request):
    """Analyze a website for accessibility issues"""
    url = request.data.get('url')
    include_suggestions = request.data.get('include_suggestions', True)
    deep_analysis = request.data.get('deep_analysis', False)
    
    if not url:
        return Response({'error': 'URL is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Parse domain
        parsed_url = urlparse(url)
        domain = parsed_url.netloc
        
        # Fetch webpage (simplified analysis)
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Basic accessibility analysis
        issues = []
        scores = {'contrast': 80, 'structure': 70, 'navigation': 75, 'content': 80}
        
        # Check for missing alt text
        images_without_alt = soup.find_all('img', alt=False)
        if images_without_alt:
            issues.append({
                'type': 'alt_text',
                'severity': 'medium',
                'description': f'{len(images_without_alt)} images missing alt text',
                'element_count': len(images_without_alt)
            })
            scores['content'] -= 10
        
        # Check for heading structure
        headings = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
        if not headings:
            issues.append({
                'type': 'structure',
                'severity': 'high',
                'description': 'No heading structure found',
                'element_count': 0
            })
            scores['structure'] -= 20
        
        # Calculate overall score
        overall_score = sum(scores.values()) // len(scores)
        
        # Save analysis
        analysis = WebsiteAnalysis.objects.create(
            url=url,
            domain=domain,
            overall_score=overall_score,
            contrast_score=scores['contrast'],
            structure_score=scores['structure'],
            navigation_score=scores['navigation'],
            content_score=scores['content'],
            issues=issues,
            analyzed_by=request.user
        )
        
        response_data = {
            'url': url,
            'domain': domain,
            'overall_score': overall_score,
            'scores': scores,
            'issues': issues
        }
        
        if include_suggestions:
            # Generate AI suggestions based on issues
            suggestions = []
            if issues:
                suggestions.append({
                    'title': 'Improve Accessibility',
                    'description': 'Consider enabling high contrast mode and larger text for better readability',
                    'type': 'visual',
                    'priority': 'high'
                })
            response_data['ai_suggestions'] = suggestions
        
        return Response(response_data)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to analyze website: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
