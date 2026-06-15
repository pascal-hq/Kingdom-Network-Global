import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SECRET_KEY")

# Debug: Print first few characters of key (for troubleshooting)
print(f"SUPABASE_URL: {url}")
print(f"SUPABASE_SECRET_KEY starts with: {key[:20] if key else 'NOT SET'}...")

if not url or not key:
    raise ValueError("SUPABASE_URL and SUPABASE_SECRET_KEY must be set in environment variables")

try:
    supabase: Client = create_client(url, key)
    print("✅ Supabase client created successfully")
except Exception as e:
    print(f"❌ Failed to create Supabase client: {e}")
    raise