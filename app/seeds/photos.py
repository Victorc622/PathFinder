from app.models import db, Photo, environment, SCHEMA
from sqlalchemy.sql import text

def seed_photos():
    photo1 = Photo(url='https://example.com/photo1.jpg', caption='Golden Gate at sunrise.', trip_id=1)
    photo2 = Photo(url='https://example.com/photo2.jpg', caption='View of Liberty Island.', trip_id=2)
    photo3 = Photo(url='https://example.com/photo3.jpg', caption='Relaxing on South Beach.', trip_id=3)

    db.session.add_all([photo1, photo2, photo3])
    db.session.commit()

def undo_photos():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.photos RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM photos"))
        
    db.session.commit()