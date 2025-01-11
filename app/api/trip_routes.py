from flask import Blueprint, request, jsonify
from app.models import Trip, db
from flask_login import login_required, current_user

trip_routes = Blueprint('trips', __name__)

@trip_routes.route('/', methods=['POST'])
@login_required
def create_trip():
    """
    Create a new trip for the logged-in user.
    """
    data = request.get_json()
    new_trip = Trip(
        name=data.get('name'),
        description=data.get('description'),
        start_date=data.get('start_date'),
        end_date=data.get('end_date'),
        owner_id=current_user.id
    )
    db.session.add(new_trip)
    db.session.commit()
    return jsonify(new_trip.to_dict()), 201

@trip_routes.route('/', methods=['GET'])
@login_required
def get_trips():
    """
    Fetch all trips for the logged-in user.
    """
    trips = Trip.query.filter_by(owner_id=current_user.id).all()
    return jsonify([trip.to_dict() for trip in trips]), 200

@trip_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_trip(id):
    """
    Fetch a specific trip by ID.
    """
    trip = Trip.query.get(id)
    if not trip or trip.owner_id != current_user.id:
        return jsonify({'error': 'Trip not found or unauthorized'}), 404
    return jsonify(trip.to_dict()), 200

@trip_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_trip(id):
    """
    Update a specific trip by ID.
    """
    trip = Trip.query.get(id)
    if not trip or trip.owner_id != current_user.id:
        return jsonify({'error': 'Trip not found or unauthorized'}), 404

    data = request.get_json()
    trip.name = data.get('name', trip.name)
    trip.description = data.get('description', trip.description)
    trip.start_date = data.get('start_date', trip.start_date)
    trip.end_date = data.get('end_date', trip.end_date)

    db.session.commit()
    return jsonify(trip.to_dict()), 200

@trip_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_trip(id):
    """
    Delete a specific trip by ID.
    """
    trip = Trip.query.get(id)
    if not trip or trip.owner_id != current_user.id:
        return jsonify({'error': 'Trip not found or unauthorized'}), 404

    db.session.delete(trip)
    db.session.commit()
    return jsonify({'message': 'Trip deleted successfully'}), 200