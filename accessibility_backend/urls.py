from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({'status': 'healthy', 'message': 'Accessibility Backend is running'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health_check'),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/users/', include('apps.users.urls')),
    path('api/accessibility/', include('apps.accessibility.urls')),
    path('api/ai/', include('apps.ai_engine.urls')),
    path('api/analytics/', include('apps.analytics.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
