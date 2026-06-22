from django.urls import path
from . import views

urlpatterns = [
    # ========== PUBLIC ==========
    path('public/content/', views.get_public_content, name='public_content'),
    path('public/events/', views.get_public_events, name='public_events'),
    path('public/settings/', views.get_public_ministry_settings, name='public_settings'),
    path('public/prayer/', views.submit_prayer_request, name='submit_prayer'),

    # ========== EVENTS (Admin + Manager) ==========
    path('events/', views.manage_events, name='events'),
    path('events/<uuid:event_id>/', views.manage_event_detail, name='event_detail'),

    # ========== PRAYERS ==========
    path('prayers/', views.manage_prayer_requests, name='prayers'),
    path('prayers/<uuid:prayer_id>/respond/', views.manage_prayer_requests, name='prayer_respond'),

    # ========== AUTH ==========
    path('auth/keep-alive/', views.keep_alive, name='keep_alive'),

    # ========== ADMIN ONLY ==========
    path('admin/content/', views.get_all_content, name='all_content'),
    path('admin/content/<uuid:content_id>/', views.manage_content, name='manage_content'),
    path('admin/settings/', views.manage_ministry_settings, name='settings'),
    path('admin/upload/', views.upload_image, name='upload_image'),
]