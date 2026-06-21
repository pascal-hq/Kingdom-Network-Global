import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kingdom_backend.settings')
django.setup()

from django.contrib.auth.models import User

# Check if admin exists
if User.objects.filter(username='admin').exists():
    user = User.objects.get(username='admin')
    user.set_password('Admin@123')
    user.save()
    print(f"✅ Password reset for {user.username}")
else:
    # Create new superuser
    User.objects.create_superuser(
        username='admin',
        email='admin@kingdomnetwork.com',
        password='Admin@123'
    )
    print("✅ New superuser 'admin' created with password 'Admin@123'")