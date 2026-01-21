from flask import Blueprint, request, jsonify
from app.services.quiz_execution_service import QuizExecutionService

quiz_execution_bp = Blueprint(
    "quiz_execution",
    __name__,
    url_prefix="/quiz-execution"
)


@quiz_execution_bp.route("/start", methods=["POST"])
def start_quiz():
    data = request.get_json()

    attempt = QuizExecutionService.start_quiz(
        quiz_id = int(data.get("quiz_id")),
        player_id = int(data.get("player_id"))
    )

    return jsonify({
        "success": True,
        "message": "Quiz started successfully",
        "data": attempt
    }), 201


@quiz_execution_bp.route("/answer", methods=["POST"])
def submit_answer():
    data = request.get_json()

    result = QuizExecutionService.submit_answer(
        attempt_id = int(data.get("attempt_id")),
        question_id = int(data.get("question_id")),
        answer_id = int(data.get("answer_id"))
    )

    return jsonify({
        "success": True,
        "message": "Answer submitted successfully",
        "data": result
    }), 200


@quiz_execution_bp.route("/finish", methods=["POST"])
def finish_quiz():
    data = request.get_json()

    result = QuizExecutionService.finish_quiz(
        attempt_id = int(data.get("attempt_id"))
    )

    return jsonify({
        "success": True,
        "message": "Quiz finished successfully",
        "data": result
    }), 200