from .db import db, environment, SCHEMA, add_prefix_for_prod

class Comment(db.Model):
    __tablename__ = 'comments'
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    trip_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('trips.id')), nullable=False)

    user = db.relationship("User", back_populates="comments")
    trip = db.relationship("Trip", back_populates="comments")

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'user_id': self.user_id,
            'trip_id': self.trip_id
        }