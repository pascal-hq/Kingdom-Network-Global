from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from django.views.decorators.csrf import csrf_exempt
from datetime import date

from .models import Department, Event, MinistrySetting, PrayerRequest
from .serializers import (
    DepartmentSerializer, EventSerializer,
    MinistrySettingSerializer, PrayerRequestSerializer
)
from .permissions import IsAdmin, IsAdminOrManager

# ========== PUBLIC ENDPOINTS ==========

@api_view(['GET'])
def get_public_content(request):
    """Public: Get all departments"""
    departments = Department.objects.all().order_by('order')
    serializer = DepartmentSerializer(departments, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_public_events(request):
    """Public: Get upcoming events"""
    today = date.today()
    events = Event.objects.filter(date__gte=today).order_by('date')
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_public_ministry_settings(request):
    """Public: Get ministry settings"""
    settings = MinistrySetting.objects.first()
    if settings:
        serializer = MinistrySettingSerializer(settings)
        return Response(serializer.data)
    return Response({})

@api_view(['POST'])
@csrf_exempt
def submit_prayer_request(request):
    """Public: Submit a prayer request"""
    try:
        # Log the incoming data for debugging
        print(f"📝 Prayer request received: {request.data}")
        
        serializer = PrayerRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            print(f"✅ Prayer request saved: {serializer.data}")
            return Response(
                {'message': 'Prayer request submitted successfully'}, 
                status=status.HTTP_201_CREATED
            )
        else:
            print(f"❌ Prayer request validation failed: {serializer.errors}")
            return Response(
                {'error': 'Validation failed', 'details': serializer.errors}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    except Exception as e:
        print(f"❌ Prayer request error: {e}")
        return Response(
            {'error': 'An error occurred', 'details': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# ========== ADMIN/MANAGER ENDPOINTS ==========

@api_view(['GET', 'POST'])
@permission_classes([IsAdminOrManager])
def manage_events(request):
    if request.method == 'GET':
        events = Event.objects.all().order_by('date')
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

    if request.method == 'POST':
        data = request.data.copy()
        if request.user.is_authenticated:
            data['created_by'] = request.user.id
        serializer = EventSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAdminOrManager])
def manage_event_detail(request, event_id):
    try:
        event = Event.objects.get(id=event_id)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = EventSerializer(event, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        event.delete()
        return Response({'message': 'Event deleted'})

@api_view(['GET', 'PUT'])
@permission_classes([IsAdminOrManager])
def manage_prayer_requests(request, prayer_id=None):
    if request.method == 'GET':
        prayers = PrayerRequest.objects.all().order_by('-created_at')
        serializer = PrayerRequestSerializer(prayers, many=True)
        return Response(serializer.data)

    if request.method == 'PUT' and prayer_id:
        try:
            prayer = PrayerRequest.objects.get(id=prayer_id)
        except PrayerRequest.DoesNotExist:
            return Response({'error': 'Prayer request not found'}, status=status.HTTP_404_NOT_FOUND)

        prayer.is_responded = True
        prayer.save()
        return Response({'message': 'Prayer marked as responded'})

# ========== ADMIN ONLY ENDPOINTS ==========

@api_view(['GET', 'PUT'])
@permission_classes([IsAdmin])
def manage_ministry_settings(request):
    settings = MinistrySetting.objects.first()

    if request.method == 'GET':
        if settings:
            serializer = MinistrySettingSerializer(settings)
            return Response(serializer.data)
        return Response({})

    if request.method == 'PUT':
        if settings:
            serializer = MinistrySettingSerializer(settings, data=request.data, partial=True)
        else:
            serializer = MinistrySettingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAdmin])
def get_all_content(request):
    departments = Department.objects.all().order_by('order')
    serializer = DepartmentSerializer(departments, many=True)
    return Response(serializer.data)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAdmin])
def manage_content(request, content_id):
    try:
        department = Department.objects.get(id=content_id)
    except Department.DoesNotExist:
        return Response({'error': 'Department not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = DepartmentSerializer(department)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = DepartmentSerializer(department, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        department.delete()
        return Response({'message': 'Department deleted'})