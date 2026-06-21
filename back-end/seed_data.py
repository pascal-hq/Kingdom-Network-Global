import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kingdom_backend.settings')
django.setup()

from api.models import Department, MinistrySetting, Event
from datetime import date, timedelta

print("🌱 Seeding initial data...")

# ========== CREATE MINISTRY SETTINGS ==========
ministry_setting, created = MinistrySetting.objects.get_or_create(
    id=1,
    defaults={
        'mission': 'Kingdom Network Global is a youth-focused Christian ministry committed to raising a generation strengthened in Christ, equipped to overcome the challenges of this present age. Our mission is to enhance spiritual growth, deepen revelation, and cultivate lasting spiritual stamina in believers, empowering them to live victorious and impactful lives.',
        'vision': 'To raise a generation of believers empowered by spiritual revelation, practical experience, and unwavering stamina in Christ.',
        'pillar_revelation': 'Guiding believers into a deeper understanding of God\'s Word and Kingdom truths.',
        'pillar_manifestation': 'Demonstrating the power and life of Christ through worship, service, and practical faith.',
        'pillar_experience': 'Encouraging personal and corporate encounters with God that transform hearts and sustain spiritual growth.'
    }
)
if created:
    print("✅ Ministry settings created")
else:
    print("ℹ️ Ministry settings already exist")

# ========== CREATE DEPARTMENTS ==========
departments_data = [
    {
        'key': 'missions',
        'name': 'Missions',
        'description': 'Extending the Kingdom through outreach, evangelism, and community impact.',
        'team_lead': 'Jack',
        'lead_bio': 'Passionate about reaching the unreached and mobilizing youth for missions.',
        'order': 1,
        'stats': {'outreaches': '30+', 'lives_reached': '2,500+', 'fields': '5', 'volunteers': '47'},
        'gallery': ['../images/home1.webp', '../images/home2.webp', '../images/home3.webp']
    },
    {
        'key': 'media',
        'name': 'Media',
        'description': 'Communicating revelation and testimony through digital platforms and creative expression.',
        'team_lead': 'Derek',
        'lead_bio': 'Creative director overseeing all media production.',
        'order': 2,
        'stats': {'youtube': '1.2K+', 'instagram': '5K+', 'facebook': '3K+', 'tiktok': '10K+'},
        'gallery': ['../images/home1.webp', '../images/home2.webp', '../images/home3.webp']
    },
    {
        'key': 'worship',
        'name': 'Praise & Worship',
        'description': 'Leading the ministry into tangible experiences of God\'s presence through worship.',
        'team_lead': 'Stephanie',
        'lead_bio': 'Anointed worship leader with a heart for God\'s presence.',
        'order': 3,
        'stats': {'services': '50+', 'songs': '100+', 'team': '20', 'albums': '3'},
        'gallery': ['../images/home1.webp', '../images/home2.webp', '../images/home3.webp']
    },
    {
        'key': 'sound',
        'name': 'Set & Sound',
        'description': 'Supporting excellence in worship and ministry atmosphere through technical service.',
        'team_lead': 'Mwangi',
        'lead_bio': 'Certified sound engineer with 8+ years of experience in live sound mixing.',
        'order': 4,
        'stats': {'events': '200+', 'volunteers': '15', 'training': '10', 'hours': '500+'},
        'gallery': ['../images/home1.webp', '../images/home2.webp', '../images/home3.webp']
    },
    {
        'key': 'mentorship',
        'name': 'Mentorship School',
        'description': 'Building spiritual stamina through intentional teaching, discipleship, and mentorship.',
        'team_lead': 'Michelle',
        'lead_bio': 'Passionate about raising the next generation of Spirit-led leaders.',
        'order': 5,
        'stats': {'students': '150+', 'mentors': '20', 'programs': '3', 'churches': '12'},
        'gallery': ['../images/home1.webp', '../images/home2.webp', '../images/home3.webp']
    }
]

for dept_data in departments_data:
    dept, created = Department.objects.get_or_create(
        key=dept_data['key'],
        defaults=dept_data
    )
    if created:
        print(f"✅ Department '{dept_data['name']}' created")
    else:
        print(f"ℹ️ Department '{dept_data['name']}' already exists")

# ========== CREATE SAMPLE EVENTS ==========
today = date.today()
events_data = [
    {
        'title': 'Youth Service',
        'date': today + timedelta(days=14),
        'location': 'Nairobi Central',
        'description': 'Join us for an evening of worship and fellowship.'
    },
    {
        'title': 'Worship Night',
        'date': today + timedelta(days=30),
        'location': 'Mombasa',
        'description': 'A night of praise and worship.'
    },
    {
        'title': 'Mentorship Session',
        'date': today + timedelta(days=45),
        'location': 'Kisumu',
        'description': 'Leadership and mentorship training.'
    }
]

for event_data in events_data:
    event, created = Event.objects.get_or_create(
        title=event_data['title'],
        defaults=event_data
    )
    if created:
        print(f"✅ Event '{event_data['title']}' created")
    else:
        print(f"ℹ️ Event '{event_data['title']}' already exists")

print("\n🎉 Data seeding complete!")