from .db import db, environment, SCHEMA, add_prefix_for_prod

class Collaboration(db.Model):
    __tablename__ = 'collaborations'
    if environment == "production":
        __tablename__ = add_prefix_for_prod(__tablename__)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    trip_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('trips.id')), nullable=False)

    user = db.relationship("User", back_populates="collaborations")
    trip = db.relationship("Trip", back_populates="collaborators")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'trip_id': self.trip_id
        }