from django.contrib import admin
from .models import Department, Event, MinistrySetting, PrayerRequest

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'key', 'team_lead', 'order')
    search_fields = ('name', 'description')
    ordering = ('order',)

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'location')
    search_fields = ('title', 'description')
    ordering = ('date',)

@admin.register(MinistrySetting)
class MinistrySettingAdmin(admin.ModelAdmin):
    list_display = ('id', 'updated_at')

@admin.register(PrayerRequest)
class PrayerRequestAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'is_responded', 'created_at')
    list_filter = ('is_responded', 'category')
    search_fields = ('name', 'request')