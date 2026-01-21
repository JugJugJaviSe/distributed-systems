from flask import Blueprint, request, jsonify, g
from flask_jwt_extended import get_jwt_identity, jwt_required
import requests
import os

from app.middlewares.require_role import require_role
from app.constants.user_roles import UserRole

quiz_execution_bp = Blueprint(
    "quiz_execution",
    __name__,
    url_prefix="/quiz-execution"
)

QUIZ_SERVICE_BASE_URL = os.path.join(os.getenv("QUIZ_SERVICE_BASE_URL"), "quiz-execution")


@quiz_execution_bp.route("/start", methods=["POST"])
@jwt_required()
def start_quiz():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    quiz_id = data.get("quiz_id")

    if not quiz_id:
        return jsonify({
            "success": False,
            "message": "quiz_id is required"
        }), 400

    payload = {
        "quiz_id": quiz_id,
        "player_id": user_id
    }

    try:
        response = requests.post(
            f"{QUIZ_SERVICE_BASE_URL}/start",
            json=payload,
            timeout=10
        )
        return jsonify(response.json()), response.status_code
    except requests.RequestException:
        return jsonify({
            "success": False,
            "message": "Quiz service is unreachable"
        }), 503


@quiz_execution_bp.route("/answer", methods=["POST"])
@jwt_required()
def submit_answer():
    data = request.get_json()
    attempt_id = data.get("attempt_id")
    question_id = data.get("question_id")
    answer_id = data.get("answer_id")

    if not attempt_id or not question_id or not answer_id:
        return jsonify({
            "success": False,
            "message": "attempt_id, question_id, and answer_id are required"
        }), 400

    payload = {
        "attempt_id": attempt_id,
        "question_id": question_id,
        "answer_id": answer_id
    }

    try:
        response = requests.post(
            f"{QUIZ_SERVICE_BASE_URL}/answer",
            json=payload,
            timeout=10
        )
        return jsonify(response.json()), response.status_code
    except requests.RequestException:
        return jsonify({
            "success": False,
            "message": "Quiz service is unreachable"
        }), 503


@quiz_execution_bp.route("/finish", methods=["POST"])
@jwt_required()
def finish_quiz():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    attempt_id = data.get("attempt_id")

    if not attempt_id:
        return jsonify({
            "success": False,
            "message": "attempt_id is required"
        }), 400

    payload = {
        "attempt_id": attempt_id,
        "player_id": user_id
    }

    try:
        response = requests.post(
            f"{QUIZ_SERVICE_BASE_URL}/finish",
            json=payload,
            timeout=10
        )
        return jsonify(response.json()), response.status_code
    except requests.RequestException:
        return jsonify({
            "success": False,
            "message": "Quiz service is unreachable"
        }), 503