from flask import Blueprint, request, jsonify
from app.models import Photo, Trip, db
from flask_login import login_required, current_user

photo_routes = Blueprint('photos', __name__)

@photo_routes.route('/trip/<int:trip_id>', methods=['GET'])
@login_required
def get_photos(trip_id):
    """
    Get all photos for a trip, ensuring the current user owns the trip.
    """
    trip = Trip.query.get(trip_id)
    if not trip or trip.owner_id != current_user.id:
        return jsonify({'error': 'Unauthorized or Trip not found'}), 403
    photos = Photo.query.filter_by(trip_id=trip_id).all()
    return jsonify([photo.to_dict() for photo in photos])

@photo_routes.route('/trip/<int:trip_id>', methods=['POST'])
@login_required
def add_photo(trip_id):
    """
    Add a photo to a trip, ensuring the current user owns the trip.
    """
    trip = Trip.query.get(trip_id)
    if not trip or trip.owner_id != current_user.id:
        return jsonify({'error': 'Unauthorized or Trip not found'}), 403
    data = request.json
    photo = Photo(
        url=data['url'],
        caption=data.get('caption', ''),
        trip_id=trip_id
    )
    db.session.add(photo)
    db.session.commit()
    return jsonify(photo.to_dict()), 201

@photo_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_photo(id):
    """
    Update a photo, ensuring the current user owns the trip associated with the photo.
    """
    photo = Photo.query.get(id)
    if not photo:
        return jsonify({'error': 'Photo not found'}), 404
    trip = Trip.query.get(photo.trip_id)
    if not trip or trip.owner_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    data = request.json
    photo.caption = data.get('caption', photo.caption)
    db.session.commit()
    return jsonify(photo.to_dict())

@photo_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_photo(id):
    """
    Delete a photo, ensuring the current user owns the trip associated with the photo.
    """
    photo = Photo.query.get(id)
    if not photo:
        return jsonify({'error': 'Photo not found'}), 404
    trip = Trip.query.get(photo.trip_id)
    if not trip or trip.owner_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    db.session.delete(photo)
    db.session.commit()
    return jsonify({'message': 'Photo deleted'})