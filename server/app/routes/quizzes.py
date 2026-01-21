from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
import requests
from app.extensions import socketio
from app.constants.user_roles import UserRole




quizzes_bp = Blueprint("quizzes", __name__, url_prefix="/quizzes")

QUIZ_SERVICE_URL = "http://127.0.0.1:5001/quizzes"

@quizzes_bp.route("", methods=["OPTIONS"])
def quizzes_options():
    return "", 200

@quizzes_bp.route("", methods=["POST"])
@jwt_required()
def create_quiz():
    
    user = get_jwt_identity()

    if get_jwt()["role"] != UserRole.MODERATOR.value:
        return {"error": "Forbidden"}, 403

    response = requests.post(
        QUIZ_SERVICE_URL,
        json=request.json,
        timeout=5
    )

    if response.status_code != 201:
        return jsonify(response.json()), response.status_code

    quiz = response.json()

    # real-time admin notification
    socketio.emit("quiz_created", quiz, room="admins")

    return quiz, 201
