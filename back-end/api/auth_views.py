from rest_framework.decorators import api_view
from rest_framework.response import Response
from supabase_client import supabase

@api_view(['POST'])
def login_user(request):
    """Login user through Supabase - secure backend call"""
    email = request.data.get('email')
    password = request.data.get('password')
    
    print("=" * 50)
    print(f"🔐 Login attempt for: {email}")
    
    if not email or not password:
        print("❌ Missing email or password")
        return Response({'error': 'Email and password required'}, status=400)
    
    try:
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        if response.user:
            role = response.user.app_metadata.get('role', 'user')
            print(f"✅ Login successful - Role: {role}")
            print(f"📋 App metadata: {response.user.app_metadata}")
            
            return Response({
                'access_token': response.session.access_token,
                'refresh_token': response.session.refresh_token,
                'user': {
                    'id': response.user.id,
                    'email': response.user.email,
                    'role': role
                }
            }, status=200)
        else:
            print("❌ Invalid credentials")
            return Response({'error': 'Invalid credentials'}, status=401)
            
    except Exception as e:
        print(f"❌ Login error: {e}")
        return Response({'error': str(e)}, status=401)