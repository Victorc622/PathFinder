from flask import Blueprint, request, jsonify
from app.models import Trip, db
from flask_login import login_required, current_user

trip_routes = Blueprint('trips', __name__)

@trip_routes.route('/', methods=['GET'])
@login_required
def get_trips():
    trips = Trip.query.filter_by(owner_id=current_user.id).all()
    return jsonify([trip.to_dict() for trip in trips])

@trip_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_trip(id):
    trip = Trip.query.get(id)
    if not trip or trip.owner_id != current_user.id:
        return jsonify({'error': 'Unauthorized or Trip not found'}), 404
    return jsonify(trip.to_dict())

@trip_routes.route('/', methods=['POST'])
@login_required
def create_trip():
    data = request.json
    trip = Trip(
        name=data['name'],
        description=data['description'],
        start_date=data['start_date'],
        end_date=data['end_date'],
        owner_id=current_user.id
    )
    db.session.add(trip)
    db.session.commit()
    return jsonify(trip.to_dict()), 201

@trip_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_trip(id):
    trip = Trip.query.get(id)
    if not trip or trip.owner_id != current_user.id:
        return jsonify({'error': 'Unauthorized or Trip not found'}), 404
    data = request.json
    trip.name = data.get('name', trip.name)
    trip.description = data.get('description', trip.description)
    trip.start_date = data.get('start_date', trip.start_date)
    trip.end_date = data.get('end_date', trip.end_date)
    db.session.commit()
    return jsonify(trip.to_dict())

@trip_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_trip(id):
    trip = Trip.query.get(id)
    if not trip or trip.owner_id != current_user.id:
        return jsonify({'error': 'Unauthorized or Trip not found'}), 404
    db.session.delete(trip)
    db.session.commit()
    return jsonify({'message': 'Trip deleted'})