from django.db import models
import uuid

class Department(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    key = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    team_lead = models.CharField(max_length=100, blank=True, null=True)
    lead_bio = models.TextField(blank=True, null=True)
    order = models.IntegerField(default=0)
    stats = models.JSONField(default=dict, blank=True)
    gallery = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['order']


class Event(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    date = models.DateField()
    location = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    poster_url = models.URLField(blank=True, null=True)
    department_key = models.CharField(max_length=50, blank=True, null=True)
    created_by = models.ForeignKey(
        'auth.User', on_delete=models.SET_NULL, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class MinistrySetting(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    mission = models.TextField()
    vision = models.TextField()
    pillar_revelation = models.TextField()
    pillar_manifestation = models.TextField()
    pillar_experience = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "Ministry Settings"


class PrayerRequest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    email = models.EmailField(blank=True, null=True)
    category = models.CharField(max_length=50)
    request = models.TextField()
    is_responded = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.category}"