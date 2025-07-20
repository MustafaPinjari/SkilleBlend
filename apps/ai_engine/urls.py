from django.urls import path
from . import views

urlpatterns = [
    path('suggestions/generate/', views.generate_suggestions, name='generate_suggestions'),
    path('suggestions/<uuid:suggestion_id>/apply/', views.apply_suggestion, name='apply_suggestion'),
    path('suggestions/<uuid:suggestion_id>/feedback/', views.provide_feedback, name='provide_feedback'),
    path('suggestions/user/', views.user_suggestions, name='user_suggestions'),
]
