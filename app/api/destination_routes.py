from flask import Blueprint, request, jsonify
from app.models import Destination, Trip, db
from flask_login import login_required, current_user

destination_routes = Blueprint('destinations', __name__)

@destination_routes.route('/trip/<int:trip_id>', methods=['GET'])
@login_required
def get_destinations(trip_id):
    """
    Get all destinations for a trip, ensuring the current user owns the trip.
    """
    trip = Trip.query.get(trip_id)
    if not trip or trip.owner_id != current_user.id:
        return jsonify({'error': 'Unauthorized or Trip not found'}), 403
    destinations = Destination.query.filter_by(trip_id=trip_id).all()
    return jsonify([destination.to_dict() for destination in destinations])

@destination_routes.route('/trip/<int:trip_id>', methods=['POST'])
@login_required
def add_destination(trip_id):
    """
    Add a destination to a trip, ensuring the current user owns the trip.
    """
    trip = Trip.query.get(trip_id)
    if not trip or trip.owner_id != current_user.id:
        return jsonify({'error': 'Unauthorized or Trip not found'}), 403
    data = request.json
    destination = Destination(
        name=data['name'],
        trip_id=trip_id,
        order=data.get('order', 1)
    )
    db.session.add(destination)
    db.session.commit()
    return jsonify(destination.to_dict()), 201

@destination_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_destination(id):
    """
    Update a destination, ensuring the current user owns the trip associated with the destination.
    """
    destination = Destination.query.get(id)
    if not destination:
        return jsonify({'error': 'Destination not found'}), 404
    trip = Trip.query.get(destination.trip_id)
    if not trip or trip.owner_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    data = request.json
    destination.name = data.get('name', destination.name)
    destination.order = data.get('order', destination.order)
    db.session.commit()
    return jsonify(destination.to_dict())

@destination_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_destination(id):
    """
    Delete a destination, ensuring the current user owns the trip associated with the destination.
    """
    destination = Destination.query.get(id)
    if not destination:
        return jsonify({'error': 'Destination not found'}), 404
    trip = Trip.query.get(destination.trip_id)
    if not trip or trip.owner_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    db.session.delete(destination)
    db.session.commit()
    return jsonify({'message': 'Destination deleted'})