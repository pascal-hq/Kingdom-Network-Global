from rest_framework.decorators import api_view
from rest_framework.response import Response
from supabase_client import supabase

@api_view(['POST'])
def login_user(request):
    """Login user through Supabase"""
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({'error': 'Email and password required'}, status=400)
    
    try:
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        if response.user:
            return Response({
                'access_token': response.session.access_token,
                'user': {
                    'email': response.user.email,
                    'role': response.user.app_metadata.get('role', 'user')
                }
            })
    except Exception as e:
        return Response({'error': str(e)}, status=401)
    
    return Response({'error': 'Invalid credentials'}, status=401)