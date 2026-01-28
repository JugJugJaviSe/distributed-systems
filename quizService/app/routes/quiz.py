from flask import Blueprint, jsonify, request

from app.validators.quiz_validator import validate_create_quiz
from app.services.quiz_service import QuizService

quiz_bp = Blueprint("quiz", __name__, url_prefix="/quiz")

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
    
    return jsonify(result), 201


@quiz_bp.route("/<int:quiz_id>", methods=["GET"])
def get_quiz(quiz_id: int):
    try:
        quiz_data = QuizService.get_quiz(quiz_id)
        return jsonify({
            "success": True,
            "data": quiz_data
        }), 200
    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 404
    except Exception as ex:
        return jsonify({
            "success": False,
            "message": f"Failed to fetch quiz {ex}"
        }), 500
    
@quiz_bp.get("/getAll")
def get_all():
    try:
        quizzes = QuizService.get_all()
        return jsonify({
            "success": True,
            "data": quizzes
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@quiz_bp.route("/admin/<int:quiz_id>", methods=["GET"])
def get_quiz_for_admin(quiz_id: int):
    try:
        quiz = QuizService.get_quiz_for_admin(quiz_id)
        return jsonify({
            "success": True,
            "data": quiz
        }), 200
    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 404
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500



@quiz_bp.route("/admin/<int:quiz_id>/approve", methods=["PUT"])
def approve_quiz(quiz_id: int):
    try:
        result = QuizService.approve_quiz(quiz_id)

        return jsonify({
            "success": True,
            "message": "Quiz approved successfully",
            "data": result
        }), 200

    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 404

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to approve quiz: {str(e)}"
        }), 500


@quiz_bp.route("/admin/<int:quiz_id>/reject", methods=["PUT"])
def reject_quiz(quiz_id: int):
    data = request.get_json(silent=True)

    if not data or not data.get("comment"):
        return jsonify({
            "success": False,
            "message": "Comment is required when rejecting a quiz"
        }), 400

    try:
        result = QuizService.reject_quiz(quiz_id, data["comment"])

        return jsonify({
            "success": True,
            "message": "Quiz rejected successfully",
            "data": result
        }), 200

    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 404

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to reject quiz: {str(e)}"
        }), 500



@quiz_bp.route("/delete/<int:quiz_id>", methods=["DELETE"])
def delete_quiz(quiz_id):
    try:
        result = QuizService.delete_quiz(quiz_id)

        if not result["success"]:
            return jsonify(result), 403

        return jsonify(result), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to delete quiz: {str(e)}"
        }), 500
