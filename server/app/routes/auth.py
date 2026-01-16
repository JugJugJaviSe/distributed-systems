from flask import Blueprint, request, jsonify
from app.services.auth_service import AuthService

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    token = AuthService.register_user(data)

    return jsonify({
        "success": True,
        "message": "User registered successfully",
        "data": token
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    result = AuthService.login_user(
        email=data.get("email"),
        password=data.get("password")
    )

    response = {
        "success": result["success"],
        "message": result["message"]
    }

    if result.get("data"):
        response["data"] = result["data"]

    return jsonify(response), result["status"]