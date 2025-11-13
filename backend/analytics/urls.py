from django.urls import path
from . import views
from .notifications import get_notifications

urlpatterns = [
    path('dashboard/', views.dashboard_overview, name='analytics-dashboard'),
    path('notifications/', get_notifications, name='notifications'),
]
