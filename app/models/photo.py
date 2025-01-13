from .db import db, environment, SCHEMA, add_prefix_for_prod

class Photo(db.Model):
    __tablename__ = 'photos'
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(2083), nullable=False)
    caption = db.Column(db.String(255), nullable=True)
    trip_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('trips.id')), nullable=False)

    trip = db.relationship("Trip", back_populates="photos")

    def to_dict(self):
        return {
            'id': self.id,
            'url': self.url,
            'caption': self.caption,
            'trip_id': self.trip_id
        }