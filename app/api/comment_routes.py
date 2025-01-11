from flask import Blueprint, request, jsonify
from app.models import Comment, db
from flask_login import login_required, current_user

comment_routes = Blueprint('comments', __name__)

@comment_routes.route('/trip/<int:trip_id>', methods=['GET'])
@login_required
def get_comments(trip_id):
    comments = Comment.query.filter_by(trip_id=trip_id).all()
    return jsonify([comment.to_dict() for comment in comments])

@comment_routes.route('/trip/<int:trip_id>', methods=['POST'])
@login_required
def add_comment(trip_id):
    data = request.json
    comment = Comment(
        content=data['content'],
        user_id=current_user.id,
        trip_id=trip_id
    )
    db.session.add(comment)
    db.session.commit()
    return jsonify(comment.to_dict()), 201

@comment_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_comment(id):
    comment = Comment.query.get(id)
    if not comment or comment.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized or Comment not found'}), 404
    data = request.json
    comment.content = data.get('content', comment.content)
    db.session.commit()
    return jsonify(comment.to_dict())

@comment_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_comment(id):
    comment = Comment.query.get(id)
    if not comment or comment.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized or Comment not found'}), 404
    db.session.delete(comment)
    db.session.commit()
    return jsonify({'message': 'Comment deleted'})