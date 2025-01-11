from app.models import db, Activity, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_activities():
    activity1 = Activity(
        name='Photo Walk',
        description='Take photos of the bridge.',
        start_time=datetime.strptime('01-16-2025 10:00 AM', '%m-%d-%Y %I:%M %p'),
        end_time=datetime.strptime('01-16-2025 12:00 PM', '%m-%d-%Y %I:%M %p'),
        destination_id=1
    )
    activity2 = Activity(
        name='Boat Tour',
        description='Ride around Liberty Island.',
        start_time=datetime.strptime('02-11-2025 11:00 AM', '%m-%d-%Y %I:%M %p'),
        end_time=datetime.strptime('02-11-2025 01:00 PM', '%m-%d-%Y %I:%M %p'),
        destination_id=2
    )
    activity3 = Activity(
        name='Surfing',
        description='Catch some waves.',
        start_time=datetime.strptime('03-02-2025 09:00 AM', '%m-%d-%Y %I:%M %p'),
        end_time=datetime.strptime('03-02-2025 11:00 AM', '%m-%d-%Y %I:%M %p'),
        destination_id=3
    )

    db.session.add_all([activity1, activity2, activity3])
    db.session.commit()

def undo_activities():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.activities RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM activities"))
        
    db.session.commit()