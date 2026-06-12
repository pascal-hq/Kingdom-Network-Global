from django.urls import path
from . import views

urlpatterns = [
    # Public endpoints (no login needed)
    path('public/content/', views.get_public_content, name='public_content'),
    path('public/events/', views.get_public_events, name='public_events'),
    path('public/settings/', views.get_public_ministry_settings, name='public_settings'),
    path('public/prayer/', views.submit_prayer_request, name='submit_prayer'),
    
    # Events (Admin + Manager)
    path('events/', views.manage_events, name='events'),
    path('events/<uuid:event_id>/', views.manage_event_detail, name='event_detail'),
    
    # Prayer Requests (Admin + Manager)
    path('prayers/', views.get_prayer_requests, name='prayers'),
    path('prayers/<uuid:prayer_id>/respond/', views.mark_prayer_responded, name='mark_responded'),
    
    # Ministry Settings (Admin only)
    path('admin/settings/', views.manage_ministry_settings, name='settings'),
    
    # Content Management (Admin only)
    path('admin/content/', views.get_all_content_admin, name='all_content'),
    path('admin/content/<uuid:content_id>/', views.manage_content, name='manage_content'),
]