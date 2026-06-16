from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from supabase_client import supabase
import uuid

# ========== HELPER FUNCTIONS ==========

def get_user_role_from_token(request):
    """Extract user role from Authorization header"""
    auth_header = request.headers.get('Authorization', '')
    print(f"🔍 Auth header: {auth_header[:50] if auth_header else 'None'}...")
    
    if not auth_header or not auth_header.startswith('Bearer '):
        print("❌ No Bearer token found")
        return None
    
    token = auth_header.replace('Bearer ', '')
    print(f"🔍 Token: {token[:50]}...")
    
    try:
        # Verify the token with Supabase
        user_response = supabase.auth.get_user(token)
        print(f"🔍 Supabase response: {user_response}")
        
        if user_response and user_response.user:
            role = user_response.user.app_metadata.get('role', 'user')
            print(f"✅ User role from metadata: {role}")
            return role
        else:
            print("❌ No user found in response")
            return None
    except Exception as e:
        print(f"❌ Auth error details: {e}")
        return None

def is_admin(request):
    role = get_user_role_from_token(request)
    print(f"🔍 is_admin check - role: {role}")
    return role == 'admin'

def is_manager(request):
    role = get_user_role_from_token(request)
    print(f"🔍 is_manager check - role: {role}")
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
    print("=" * 50)
    print("📌 manage_ministry_settings called")
    print(f"Method: {request.method}")
    
    if not is_admin(request):
        print("❌ Admin access denied")
        return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)
    
    print("✅ Admin access granted")
    
    try:
        if request.method == 'GET':
            print("📡 Fetching ministry settings from Supabase...")
            response = supabase.table('ministry_settings').select('*').limit(1).execute()
            print(f"📡 Supabase response: {response.data}")
            
            if response.data and len(response.data) > 0:
                return Response(response.data[0])
            else:
                print("⚠️ No settings found, returning empty")
                return Response({}, status=status.HTTP_404_NOT_FOUND)
        
        elif request.method == 'PUT':
            settings_id = request.data.get('id')
            print(f"📡 Updating settings ID: {settings_id}")
            
            if not settings_id:
                return Response({'error': 'Settings ID required'}, status=status.HTTP_400_BAD_REQUEST)
            
            update_data = {
                'mission': request.data.get('mission', ''),
                'vision': request.data.get('vision', ''),
                'pillar_revelation': request.data.get('pillar_revelation', ''),
                'pillar_manifestation': request.data.get('pillar_manifestation', ''),
                'pillar_experience': request.data.get('pillar_experience', '')
            }
            
            response = supabase.table('ministry_settings').update(update_data).eq('id', settings_id).execute()
            return Response(response.data[0] if response.data else {})
    except Exception as e:
        print(f"❌ Error: {e}")
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
def get_public_content(request):
    """Public: Get all departments and content"""
    try:
        print("🔍 get_public_content called")
        print(f"🔍 Supabase URL: {supabase.supabase_url}")
        response = supabase.table('content').select('*').execute()
        print(f"📡 Response data: {response.data}")
        print(f"📡 Response count: {len(response.data) if response.data else 0}")
        return Response(response.data)
    except Exception as e:
        print(f"❌ Error: {e}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)