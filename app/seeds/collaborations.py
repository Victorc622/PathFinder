from app.models import db, Collaboration, environment, SCHEMA
from sqlalchemy.sql import text

def seed_collaborations():
    collaboration1 = Collaboration(user_id=2, trip_id=1)
    collaboration2 = Collaboration(user_id=3, trip_id=2)
    collaboration3 = Collaboration(user_id=1, trip_id=3)

    db.session.add_all([collaboration1, collaboration2, collaboration3])
    db.session.commit()

def undo_collaborations():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.collaborations RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM collaborations"))
        
    db.session.commit()