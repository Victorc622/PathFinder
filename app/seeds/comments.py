from app.models import db, Comment, environment, SCHEMA
from sqlalchemy.sql import text

def seed_comments():
    comment1 = Comment(content='Amazing trip!', user_id=1, trip_id=1)
    comment2 = Comment(content='Can’t wait to visit again.', user_id=2, trip_id=2)
    comment3 = Comment(content='Best beach vacation ever!', user_id=3, trip_id=3)

    db.session.add_all([comment1, comment2, comment3])
    db.session.commit()

def undo_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM comments"))
        
    db.session.commit()