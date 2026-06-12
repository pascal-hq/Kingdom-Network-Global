from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from supabase_client import supabase
import uuid

# ========== HELPER FUNCTIONS ==========

def get_user_role_from_token(request):
    """Extract user role from Authorization header"""
    auth_header = request.headers.get('Authorization', '')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    
    token = auth_header.replace('Bearer ', '')
    try:
        user = supabase.auth.get_user(token)
        if user.user:
            return user.user.app_metadata.get('role', 'user')
    except Exception as e:
        print(f"Auth error: {e}")
    return None

def is_admin(request):
    return get_user_role_from_token(request) == 'admin'

def is_manager(request):
    role = get_user_role_from_token(request)
    return role in ['admin', 'manager']

# ========== PUBLIC ENDPOINTS (No authentication needed) ==========

@api_view(['GET'])
def get_public_content(request):
    """Public: Get all departments and content"""
    try:
        response = supabase.table('content').select('*').execute()
        return Response(response.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_public_events(request):
    """Public: Get all events"""
    try:
        response = supabase.table('events').select('*').order('date').execute()
        return Response(response.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_public_ministry_settings(request):
    """Public: Get ministry settings"""
    try:
        response = supabase.table('ministry_settings').select('*').limit(1).execute()
        data = response.data[0] if response.data else {}
        return Response(data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def submit_prayer_request(request):
    """Public: Submit a prayer request"""
    try:
        data = request.data
        required_fields = ['name', 'request', 'category']
        
        for field in required_fields:
            if not data.get(field):
                return Response({'error': f'{field} is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        prayer_data = {
            'id': str(uuid.uuid4()),
            'name': data['name'],
            'email': data.get('email', ''),
            'category': data['category'],
            'request': data['request'],
            'is_responded': False
        }
        
        response = supabase.table('prayer_requests').insert(prayer_data).execute()
        return Response({'message': 'Prayer request submitted successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ========== EVENTS (Admin + Manager only) ==========

@api_view(['GET', 'POST'])
def manage_events(request):
    """Admin/Manager: Get all events or create new event"""
    if not is_manager(request):
        return Response({'error': 'Permission denied. Admin or Manager access required.'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        if request.method == 'GET':
            response = supabase.table('events').select('*').order('date').execute()
            return Response(response.data)
        
        elif request.method == 'POST':
            event_data = {
                'id': str(uuid.uuid4()),
                'title': request.data.get('title'),
                'date': request.data.get('date'),
                'location': request.data.get('location'),
                'description': request.data.get('description'),
                'poster_url': request.data.get('poster_url', '')
            }
            response = supabase.table('events').insert(event_data).execute()
            return Response(response.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT', 'DELETE'])
def manage_event_detail(request, event_id):
    """Admin/Manager: Update or delete specific event"""
    if not is_manager(request):
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        if request.method == 'PUT':
            response = supabase.table('events').update(request.data).eq('id', event_id).execute()
            return Response(response.data)
        
        elif request.method == 'DELETE':
            response = supabase.table('events').delete().eq('id', event_id).execute()
            return Response({'message': 'Event deleted successfully'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ========== PRAYER REQUESTS (Admin + Manager only) ==========

@api_view(['GET'])
def get_prayer_requests(request):
    """Admin/Manager: View all prayer requests"""
    if not is_manager(request):
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        response = supabase.table('prayer_requests').select('*').order('created_at', desc=True).execute()
        return Response(response.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
def mark_prayer_responded(request, prayer_id):
    """Admin/Manager: Mark prayer as responded"""
    if not is_manager(request):
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        response = supabase.table('prayer_requests').update({'is_responded': True}).eq('id', prayer_id).execute()
        return Response({'message': 'Prayer marked as responded'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ========== ADMIN ONLY ENDPOINTS ==========

@api_view(['GET', 'PUT'])
def manage_ministry_settings(request):
    """Admin only: Get or update ministry settings"""
    if not is_admin(request):
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        if request.method == 'GET':
            response = supabase.table('ministry_settings').select('*').limit(1).execute()
            return Response(response.data[0] if response.data else {})
        
        elif request.method == 'PUT':
            settings_id = request.data.get('id')
            if not settings_id:
                return Response({'error': 'Settings ID required'}, status=status.HTTP_400_BAD_REQUEST)
            response = supabase.table('ministry_settings').update(request.data).eq('id', settings_id).execute()
            return Response(response.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'PUT', 'DELETE'])
def manage_content(request, content_id):
    """Admin only: Update or delete content (departments, programs)"""
    if not is_admin(request):
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        if request.method == 'GET':
            response = supabase.table('content').select('*').eq('id', content_id).execute()
            return Response(response.data[0] if response.data else {})
        
        elif request.method == 'PUT':
            response = supabase.table('content').update(request.data).eq('id', content_id).execute()
            return Response(response.data)
        
        elif request.method == 'DELETE':
            response = supabase.table('content').delete().eq('id', content_id).execute()
            return Response({'message': 'Content deleted successfully'})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_all_content_admin(request):
    """Admin only: Get all content"""
    if not is_admin(request):
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        response = supabase.table('content').select('*').execute()
        return Response(response.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)