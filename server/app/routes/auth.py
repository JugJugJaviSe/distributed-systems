from flask import Blueprint, request, jsonify
from app.services.user_service import register_user
from flask_jwt_extended import create_access_token
from datetime import datetime, timezone, timedelta

from app.extensions import db
from app.models.user import User

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route("/register", methods=["POST"])
def register():
    print("I got the payload")
    data = request.get_json()
    user = register_user(data)
    print(f"User created -> ID: {user.id}, Name: {user.first_name} {user.last_name}, Email: {user.email}")
    
    token = create_access_token(identity={
        "id": user.id,
        "email": user.email,
        "role": user.role
    })

    return jsonify({
        "success": True,
        "message": "User registered successfully",
        "data": token
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({
            "success": False,
            "message": "Invalid credentials"
        }), 401

    # Check if user is currently blocked
    if user.blocked_until and user.blocked_until > datetime.utcnow():
        return jsonify({
            "success": False,
            "message": f"Too many unsuccessful login attempts. Account blocked for 60 seconds." # 15 minutes by specification
        }), 403

    # Check password
    if not user.check_password(password):
        user.failed_login_attempts += 1

        if user.failed_login_attempts >= 3:
            user.blocked_until = datetime.utcnow() + timedelta(minutes=1)  # 1 minute for testing, should be 15 by specification
            user.failed_login_attempts = 0  # Reset counter

        # Save changes
        db.session.commit()

        return jsonify({
            "success": False,
            "message": "Invalid credentials"
        }), 401

    # Successful login
    user.failed_login_attempts = 0
    user.blocked_until = None
    db.session.commit()

    token = create_access_token(identity={
        "id": user.id,
        "email": user.email,
        "role": user.role
    })

    return jsonify({
        "success": True,
        "message": "Login successful",
        "data": token
    }), 200