from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserProfile

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'first_name', 'last_name', 'is_premium', 'created_at', 'last_active']
    list_filter = ['is_premium', 'allow_analytics', 'allow_ai_suggestions', 'created_at']
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['-created_at']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Accessibility Settings', {
            'fields': ('accessibility_needs', 'preferred_settings', 'is_premium')
        }),
        ('Privacy Settings', {
            'fields': ('allow_analytics', 'allow_ai_suggestions')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'last_active'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at', 'last_active']

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'disability_type', 'preferred_theme', 'preferred_language']
    list_filter = ['disability_type', 'preferred_theme', 'preferred_language']
    search_fields = ['user__email']
