from flask import Blueprint, jsonify
from app.services.quiz_attempts_service import AttemptsService

quiz_leaderboard_bp = Blueprint("quiz-leaderboard", __name__, url_prefix="/quiz")

@quiz_leaderboard_bp.get("/<int:quiz_id>/leaderboard")
def get_leaderboard(quiz_id: int):
    try:
        attempts = AttemptsService.get_attempts_for_quizzes([str(quiz_id)])

        return jsonify({
            "success": True,
            "data": attempts
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
