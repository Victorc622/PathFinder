from flask import Blueprint, request, jsonify
from app.models import Activity, Destination, Trip, db
from flask_login import login_required, current_user

activity_routes = Blueprint('activities', __name__)

@activity_routes.route('/destination/<int:destination_id>', methods=['GET'])
@login_required
def get_activities(destination_id):
    """
    Get all activities for a destination, ensuring the current user owns the trip associated with the destination.
    """
    destination = Destination.query.get(destination_id)
    if not destination:
        return jsonify({'error': 'Destination not found'}), 404
    trip = Trip.query.get(destination.trip_id)
    if not trip or trip.owner_id != current_user.id:
        return jsonify({'error': 'Unauthorized or Trip not found'}), 403
    activities = Activity.query.filter_by(destination_id=destination_id).all()
    return jsonify([activity.to_dict() for activity in activities])

@activity_routes.route('/destination/<int:destination_id>', methods=['POST'])
@login_required
def add_activity(destination_id):
    """
    Add an activity to a destination, ensuring the current user owns the trip associated with the destination.
    """
    destination = Destination.query.get(destination_id)
    if not destination:
        return jsonify({'error': 'Destination not found'}), 404
    trip = Trip.query.get(destination.trip_id)
    if not trip or trip.owner_id != current_user.id:
        return jsonify({'error': 'Unauthorized or Trip not found'}), 403
    data = request.json
    activity = Activity(
        name=data['name'],
        description=data['description'],
        start_time=data['start_time'],
        end_time=data['end_time'],
        destination_id=destination_id
    )
    db.session.add(activity)
    db.session.commit()
    return jsonify(activity.to_dict()), 201

@activity_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_activity(id):
    """
    Update an activity, ensuring the current user owns the trip associated with the activity's destination.
    """
    activity = Activity.query.get(id)
    if not activity:
        return jsonify({'error': 'Activity not found'}), 404
    destination = Destination.query.get(activity.destination_id)
    trip = Trip.query.get(destination.trip_id)
    if not trip or trip.owner_id != current_user.id:
        return jsonify({'error': 'Unauthorized or Trip not found'}), 403
    data = request.json
    activity.name = data.get('name', activity.name)
    activity.description = data.get('description', activity.description)
    activity.start_time = data.get('start_time', activity.start_time)
    activity.end_time = data.get('end_time', activity.end_time)
    db.session.commit()
    return jsonify(activity.to_dict())

@activity_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_activity(id):
    """
    Delete an activity, ensuring the current user owns the trip associated with the activity's destination.
    """
    activity = Activity.query.get(id)
    if not activity:
        return jsonify({'error': 'Activity not found'}), 404
    destination = Destination.query.get(activity.destination_id)
    trip = Trip.query.get(destination.trip_id)
    if not trip or trip.owner_id != current_user.id:
        return jsonify({'error': 'Unauthorized or Trip not found'}), 403
    db.session.delete(activity)
    db.session.commit()
    return jsonify({'message': 'Activity deleted'})