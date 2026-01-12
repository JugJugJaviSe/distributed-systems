from flask import Blueprint, request, jsonify
from app.services.user_service import register_user
from flask_jwt_extended import create_access_token

from app.models.user import User

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    user = register_user(data)
    print(f"User created -> ID: {user.id}, Name: {user.first_name} {user.last_name}, Email: {user.email}")
    
    token = create_access_token(identity={
        "id": user.id,
        "email": user.email,
        "role": user.role
    })

    return jsonify({
        "msg": "User registered successfully",
        "token": token
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"msg": "Invalid credentials"}), 401
    
    token = create_access_token(identity={
        "id": user.id,
        "email": user.email,
        "role": user.role
    })

    return jsonify({
        "msg": "Login successful",
        "token": token
    }), 200