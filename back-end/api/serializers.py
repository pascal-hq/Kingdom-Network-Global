from rest_framework import serializers
from .models import Department, Event, MinistrySetting, PrayerRequest

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'key', 'name', 'description', 'team_lead', 'lead_bio', 'order', 'stats', 'gallery', 'created_at', 'updated_at']

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'date', 'location', 'description', 'poster_url', 'department_key', 'created_at']

class MinistrySettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = MinistrySetting
        fields = ['id', 'mission', 'vision', 'pillar_revelation', 'pillar_manifestation', 'pillar_experience', 'updated_at']

class PrayerRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrayerRequest
        fields = ['id', 'name', 'email', 'category', 'request', 'is_responded', 'created_at']