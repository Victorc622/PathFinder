from .db import db, environment, SCHEMA, add_prefix_for_prod

class Activity(db.Model):
    __tablename__ = 'activities'
    if environment == "production":
        __tablename__ = add_prefix_for_prod(__tablename__)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    start_time = db.Column(db.DateTime, nullable=False)
    end_time = db.Column(db.DateTime, nullable=False)
    destination_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('destinations.id')), nullable=False)

    destination = db.relationship("Destination", back_populates="activities")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'start_time': self.start_time.strftime('%m-%d-%Y'),
            'end_time': self.end_time.strftime('%m-%d-%Y'),
            'destination_id': self.destination_id
        }