from django.urls import path
from . import views

urlpatterns = [
    path('settings/current/', views.AccessibilitySettingsView.as_view(), name='current_settings'),
    path('settings/bulk_update/', views.bulk_update_settings, name='bulk_update_settings'),
    path('presets/', views.AccessibilityPresetListView.as_view(), name='presets'),
    path('presets/<uuid:preset_id>/apply/', views.apply_preset, name='apply_preset'),
    path('analysis/analyze/', views.analyze_website, name='analyze_website'),
]
