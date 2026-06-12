import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SECRET_KEY")  # This is the SECRET key

if not url or not key:
    raise ValueError("SUPABASE_URL and SUPABASE_SECRET_KEY must be set in .env file")

supabase: Client = create_client(url, key)