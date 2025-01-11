from app.models import db, Trip, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_trips():
    trip1 = Trip(
        name='Road Trip to California',
        description='A scenic drive along the coast.',
        start_date=datetime.strptime('01-15-2025', '%m-%d-%Y').date(),
        end_date=datetime.strptime('01-20-2025', '%m-%d-%Y').date(),
        owner_id=1
    )
    trip2 = Trip(
        name='Weekend in NYC',
        description='Exploring the city that never sleeps.',
        start_date=datetime.strptime('02-10-2025', '%m-%d-%Y').date(),
        end_date=datetime.strptime('02-12-2025', '%m-%d-%Y').date(),
        owner_id=2
    )
    trip3 = Trip(
        name='Beach Vacation in Miami',
        description='Relaxing at the beach.',
        start_date=datetime.strptime('03-01-2025', '%m-%d-%Y').date(),
        end_date=datetime.strptime('03-05-2025', '%m-%d-%Y').date(),
        owner_id=3
    )

    db.session.add_all([trip1, trip2, trip3])
    db.session.commit()

def undo_trips():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.trips RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM trips"))
        
    db.session.commit()