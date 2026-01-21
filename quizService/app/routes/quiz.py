from flask import Blueprint, jsonify, request

from app.validators.quiz_validator import validate_create_quiz
from app.services.quiz_service import QuizService

quiz_bp = Blueprint("quiz", __name__, url_prefix="/quizzes")

@quiz_bp.post("")
def create_quiz():
    payload = request.get_json(silent=True)

    validation = validate_create_quiz(payload)
    if not validation.ok:
        return (
            jsonify(
                {
                    "success": False,
                    "message": "Validation error",
                    "errors": validation.errors,
                }
            ),
            400,
        )

    result = QuizService.create_quiz(validation.data)
    status = result.pop("status", 201)

    return jsonify(result), status
