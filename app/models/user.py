from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)

    trips = db.relationship("Trip", back_populates="owner", cascade="all, delete-orphan")
    comments = db.relationship("Comment", back_populates="user", cascade="all, delete-orphan")
    collaborations = db.relationship("Collaboration", back_populates="user", cascade="all, delete-orphan")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.hashed_password, password)

    def to_dict(self, include_related=False):
        user_dict = {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }

        if include_related:
            user_dict.update({
                'trips': [trip.to_dict() for trip in self.trips],
                'comments': [comment.to_dict() for comment in self.comments],
                'collaborations': [collaboration.to_dict() for collaboration in self.collaborations],
            })

        return user_dict