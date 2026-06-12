from supabase_client import supabase

# ========== CONTENT (Departments, Programs) ==========

def get_all_content():
    """Get all content from content table"""
    response = supabase.table('content').select('*').execute()
    return response.data

def get_content_by_type(content_type):
    """Get content by type (e.g., 'department', 'program')"""
    response = supabase.table('content').select('*').eq('type', content_type).execute()
    return response.data

def update_content(content_id, data):
    """Update content by ID"""
    response = supabase.table('content').update(data).eq('id', content_id).execute()
    return response.data

def create_content(content_data):
    """Create new content"""
    response = supabase.table('content').insert(content_data).execute()
    return response.data

def delete_content(content_id):
    """Delete content by ID (Admin only)"""
    response = supabase.table('content').delete().eq('id', content_id).execute()
    return response.data

# ========== EVENTS ==========

def get_all_events():
    """Get all events, ordered by date"""
    response = supabase.table('events').select('*').order('date').execute()
    return response.data

def get_upcoming_events():
    """Get only upcoming events"""
    response = supabase.table('events').select('*').gte('date', 'today').order('date').execute()
    return response.data

def create_event(event_data):
    """Create new event"""
    response = supabase.table('events').insert(event_data).execute()
    return response.data

def update_event(event_id, event_data):
    """Update event by ID"""
    response = supabase.table('events').update(event_data).eq('id', event_id).execute()
    return response.data

def delete_event(event_id):
    """Delete event by ID"""
    response = supabase.table('events').delete().eq('id', event_id).execute()
    return response.data

# ========== PRAYER REQUESTS ==========

def get_all_prayer_requests():
    """Get all prayer requests"""
    response = supabase.table('prayer_requests').select('*').order('created_at', desc=True).execute()
    return response.data

def create_prayer_request(prayer_data):
    """Create new prayer request (public)"""
    response = supabase.table('prayer_requests').insert(prayer_data).execute()
    return response.data

def update_prayer_request(prayer_id, prayer_data):
    """Update prayer request (mark responded)"""
    response = supabase.table('prayer_requests').update(prayer_data).eq('id', prayer_id).execute()
    return response.data

def delete_prayer_request(prayer_id):
    """Delete prayer request (Admin only)"""
    response = supabase.table('prayer_requests').delete().eq('id', prayer_id).execute()
    return response.data

# ========== MINISTRY SETTINGS ==========

def get_ministry_settings():
    """Get ministry settings (mission, vision, pillars)"""
    response = supabase.table('ministry_settings').select('*').limit(1).execute()
    return response.data[0] if response.data else None

def update_ministry_settings(settings_id, settings_data):
    """Update ministry settings (Admin only)"""
    response = supabase.table('ministry_settings').update(settings_data).eq('id', settings_id).execute()
    return response.data

# ========== AUTH / USER HELPERS ==========

def get_user_role(user_id):
    """Get user role from Supabase Auth"""
    response = supabase.auth.admin.get_user_by_id(user_id)
    if response.user:
        app_metadata = response.user.app_metadata
        return app_metadata.get('role', 'user')
    return 'user'