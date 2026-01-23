import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
import requests
from app.extensions import socketio
from app.constants.user_roles import UserRole
from app.middlewares.require_auth import require_auth
from app.middlewares.require_role import require_role 
from app.services.quiz_service import QuizService
from app.services.user_service import UserService

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
    
@quiz_bp.get("/allQuizzes")
@require_auth
def get_all_quizzes():
    try:
        quizzes = QuizService.get_all_quizzes_from_quizService()

        users = UserService.get_all_user_emails()
        id_to_email = {user["id"]: user["email"] for user in users}

        for quiz in quizzes["data"]:
            author_id = quiz.pop("author_id", None)
            quiz["author_email"] = id_to_email.get(author_id, "unknown@example.com")

        return jsonify(quizzes), 200

    except requests.exceptions.RequestException as e:
        return jsonify({"success": False, "message": str(e)}), 500

@quiz_bp.get("/admin/<int:quiz_id>")
@require_role([UserRole.ADMIN])
def get_quiz_for_admin(quiz_id: int):
    try:
        response = requests.get(
            f"{QUIZ_SERVICE_BASE_URL}/admin/{quiz_id}",
            timeout=10
        )

        return jsonify(response.json()), response.status_code

    except requests.RequestException:
        return jsonify({
            "success": False,
            "message": "Quiz service is unreachable"
        }), 503