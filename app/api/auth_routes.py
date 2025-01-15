from flask import Blueprint, request, jsonify, session
from app.models import User, db
from app.forms import LoginForm, SignUpForm
from flask_login import current_user, login_user, logout_user, login_required

auth_routes = Blueprint('auth', __name__)

@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user and returns their information if logged in.
    """
    if current_user.is_authenticated:
        return jsonify(current_user.to_dict())
    return jsonify({'errors': {'message': 'Unauthorized'}}), 401


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in and returns their information.
    """
    form = LoginForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.data['email']).first()
        if user and user.check_password(form.data['password']):
            session.clear()
            login_user(user)
            return jsonify(user.to_dict())
        return jsonify({'errors': {'message': 'Invalid email or password'}}), 401
    return jsonify({'errors': form.errors}), 401


@auth_routes.route('/logout', methods=['POST'])
@login_required
def logout():
    """
    Logs a user out and clears their session.
    """
    logout_user()
    session.clear()
    return jsonify({'message': 'User logged out'})


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user, logs them in, and returns their information.
    """
    form = SignUpForm()
    form['csrf_token'].data = request.cookies.get('csrf_token')
    if form.validate_on_submit():
        user = User(
            username=form.data['username'],
            email=form.data['email'],
            password=form.data['password']
        )
        db.session.add(user)
        db.session.commit()
        login_user(user)
        return jsonify(user.to_dict())
    return jsonify({'errors': form.errors}), 401


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns an unauthorized JSON response when flask-login authentication fails.
    """
    return jsonify({'errors': {'message': 'Unauthorized'}}), 401