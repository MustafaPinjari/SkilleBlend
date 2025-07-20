from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer
from .models import User, UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['disability_type', 'assistive_technology', 'preferred_theme', 'preferred_language']

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'accessibility_needs', 'preferred_settings', 'is_premium',
            'allow_analytics', 'allow_ai_suggestions', 'profile',
            'created_at', 'last_active'
        ]
        read_only_fields = ['id', 'created_at', 'is_premium']

class CustomRegisterSerializer(RegisterSerializer):
    first_name = serializers.CharField(max_length=30, required=False)
    last_name = serializers.CharField(max_length=30, required=False)
    
    def get_cleaned_data(self):
        data = super().get_cleaned_data()
        data.update({
            'first_name': self.validated_data.get('first_name', ''),
            'last_name': self.validated_data.get('last_name', ''),
        })
        return data
    
    def save(self, request):
        user = super().save(request)
        user.first_name = self.cleaned_data.get('first_name', '')
        user.last_name = self.cleaned_data.get('last_name', '')
        user.save()
        
        # Create user profile
        UserProfile.objects.create(user=user)
        
        return user
