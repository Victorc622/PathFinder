from .db import db, environment, SCHEMA, add_prefix_for_prod

class Destination(db.Model):
    __tablename__ = 'destinations'
    if environment == "production":
        __tablename__ = add_prefix_for_prod(__tablename__)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    trip_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('trips.id')), nullable=False)
    order = db.Column(db.Integer, nullable=False, default=1)

    trip = db.relationship("Trip", back_populates="destinations")
    activities = db.relationship("Activity", back_populates="destination", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'trip_id': self.trip_id,
            'order': self.order
        }