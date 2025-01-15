from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Trip(db.Model):
    __tablename__ = 'trips'
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    _start_date = db.Column('start_date', db.Date, nullable=False)
    _end_date = db.Column('end_date', db.Date, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)

    owner = db.relationship("User", back_populates="trips")
    destinations = db.relationship("Destination", back_populates="trip", cascade="all, delete-orphan")
    photos = db.relationship("Photo", back_populates="trip", cascade="all, delete-orphan")
    collaborators = db.relationship("Collaboration", back_populates="trip", cascade="all, delete-orphan")
    comments = db.relationship("Comment", back_populates="trip", cascade="all, delete-orphan")

    @property
    def start_date(self):
        return self._start_date

    @start_date.setter
    def start_date(self, value):
        try:
            if isinstance(value, datetime):
                self._start_date = value.date()
            elif isinstance(value, str):
                self._start_date = datetime.strptime(value, "%m-%d-%Y").date()
            else:
                self._start_date = value
        except ValueError:
            raise ValueError("Invalid start date format. Expected MM-DD-YYYY.")

    @property
    def end_date(self):
        return self._end_date

    @end_date.setter
    def end_date(self, value):
        try:
            if isinstance(value, datetime):
                self._end_date = value.date()
            elif isinstance(value, str):
                self._end_date = datetime.strptime(value, "%m-%d-%Y").date()
            else:
                self._end_date = value
        except ValueError:
            raise ValueError("Invalid end date format. Expected MM-DD-YYYY.")

    def to_dict(self, include_related=False):
        trip_dict = {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'start_date': self.start_date.strftime('%m-%d-%Y'),
            'end_date': self.end_date.strftime('%m-%d-%Y'),
            'owner_id': self.owner_id,
        }

        if include_related:
            trip_dict.update({
                'destinations': [destination.to_dict() for destination in self.destinations],
                'photos': [photo.to_dict() for photo in self.photos],
                'collaborators': [collaborator.to_dict() for collaborator in self.collaborators],
                'comments': [comment.to_dict() for comment in self.comments],
            })

        return trip_dict