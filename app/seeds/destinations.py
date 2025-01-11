from app.models import db, Destination, environment, SCHEMA
from sqlalchemy.sql import text

def seed_destinations():
    destination1 = Destination(name='Golden Gate Bridge', trip_id=1, order=1)
    destination2 = Destination(name='Statue of Liberty', trip_id=2, order=1)
    destination3 = Destination(name='South Beach', trip_id=3, order=1)

    db.session.add_all([destination1, destination2, destination3])
    db.session.commit()

def undo_destinations():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.destinations RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM destinations"))
        
    db.session.commit()