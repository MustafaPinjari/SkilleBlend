from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.user_dashboard, name='user_dashboard'),
    path('usage/', views.track_usage, name='track_usage'),
    path('global_stats/', views.global_stats, name='global_stats'),
]
