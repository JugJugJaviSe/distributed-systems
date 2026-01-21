import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
import requests
from app.extensions import socketio
from app.constants.user_roles import UserRole
from app.middlewares.require_role import require_role

quiz_bp = Blueprint("quiz", __name__, url_prefix="/quiz")

QUIZ_SERVICE_BASE_URL = os.path.join(os.getenv("QUIZ_SERVICE_BASE_URL"), "quiz")

@quiz_bp.route("", methods=["OPTIONS"])
def quiz_options():
    return "", 200

@quiz_bp.route("", methods=["POST"])
@jwt_required()
def create_quiz():
    
    user = get_jwt_identity()

    if get_jwt()["role"] != UserRole.MODERATOR.value:
        return {"error": "Forbidden"}, 403

    response = requests.post(
        QUIZ_SERVICE_BASE_URL,
        json=request.json,
        timeout=5
    )

    if response.status_code != 201:
        return jsonify(response.json()), response.status_code

    quiz = response.json()

    # real-time admin notification
    socketio.emit("quiz_created", quiz, room="admins")

    return quiz, 201


@quiz_bp.route("/<int:quiz_id>", methods=["GET"])
def get_quiz(quiz_id: int):
    try:
        response = requests.get(
            f"{QUIZ_SERVICE_BASE_URL}/{quiz_id}",
            timeout=10
        )
        return jsonify(response.json()), response.status_code
    except requests.RequestException:
        return jsonify({
            "success": False,
            "message": "Quiz service is unreachable"
        }), 503