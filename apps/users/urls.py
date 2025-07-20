from django.urls import path
from . import views

urlpatterns = [
    path('me/', views.CurrentUserView.as_view(), name='current_user'),
    path('sync_settings/', views.sync_settings, name='sync_settings'),
    path('stats/', views.user_stats, name='user_stats'),
]
