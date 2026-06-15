from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),  # ← This must be exactly this
    path('dashboard/', TemplateView.as_view(template_name='admin_dashboard.html'), name='dashboard'),
]