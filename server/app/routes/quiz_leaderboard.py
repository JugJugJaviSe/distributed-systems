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

quiz_leaderboard_bp = Blueprint("quiz-leaderboard", __name__, url_prefix="/quiz")

base = (os.getenv("QUIZ_SERVICE_BASE_URL") or "").rstrip("/")
QUIZ_SERVICE_BASE_URL = f"{base}/quiz"

@quiz_leaderboard_bp.get("/<int:quiz_id>/leaderboard")
def get_leaderboard(quiz_id: int):
    try:
        url = f"{QUIZ_SERVICE_BASE_URL}/{quiz_id}/leaderboard"

        resp = requests.get(url, timeout=20)

        return jsonify(resp.json()), resp.status_code

    except requests.RequestException as e:
        return jsonify({
            "success": False,
            "message": f"Quiz service unreachable: {str(e)}"
        }), 503
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }),

