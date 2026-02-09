from flask import Blueprint, jsonify, request

from app.validators.create_quiz_validator import validate_create_quiz
from app.validators.edit_quiz_validator import validate_edit_quiz
from app.validators.reject_quiz_validator import validate_reject_quiz
from app.services.quiz_service import QuizService

quiz_bp = Blueprint("quiz", __name__, url_prefix="/quiz")

@quiz_bp.post("")
def create_quiz():
    payload = request.get_json(silent=True)

    validation = validate_create_quiz(payload)
    if not validation.ok:
        return jsonify({
            "success": False,
            "message": "Validation error",
            "errors": validation.errors
        }), 400

    try:
        result = QuizService.create_quiz(validation.data)
        return jsonify({
            "success": True,
            "data": result
        }), 201

    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to create quiz: {str(e)}"
        }), 500



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
    
@quiz_bp.get("/getApproved")
def get_approved():
    try:
        quizzes = QuizService.get_approved()
        return jsonify({
            "success": True,
            "data": quizzes
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500
    
@quiz_bp.get("/getPending")
def get_pending():
    try:
        quizzes = QuizService.get_pending()
        return jsonify({
            "success": True,
            "data": quizzes
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@quiz_bp.get("/catalog")
def get_catalog():
    try:
        page = request.args.get("page", 1, type=int)
        page_size = request.args.get("page_size", 12, type=int)

        data = QuizService.get_catalog(page=page, page_size=page_size)
        return jsonify({
            "success": True,
            "data": data
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
        }), 400

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to approve quiz: {str(e)}"
        }), 500


@quiz_bp.route("/admin/<int:quiz_id>/reject", methods=["PUT"])
def reject_quiz(quiz_id: int):
    payload = request.get_json(silent=True)

    validation = validate_reject_quiz(payload)
    if not validation.ok:
        return jsonify({
            "success": False,
            "message": "Validation error",
            "errors": validation.errors
        }), 400

    try:
        result = QuizService.reject_quiz(quiz_id, validation.data["comment"])

        return jsonify({
            "success": True,
            "message": "Quiz rejected successfully",
            "data": result
        }), 200

    except ValueError as e:
        msg = str(e)
        if "not found" in msg:
            return jsonify({"success": False, "message": msg}), 404
        return jsonify({"success": False, "message": msg}), 400

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
            return jsonify(result), 404

        return jsonify(result), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to delete quiz: {str(e)}"
        }), 500

@quiz_bp.get("/my/<int:user_id>")
def get_my_quizzes(user_id: int):
    try:
        quizzes = QuizService.get_by_author(user_id)
        return jsonify({
            "success": True,
            "data": quizzes
        }), 200
    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500

@quiz_bp.route("/getRejected/<int:quiz_id>", methods=["GET"])
def get_rejected_quiz(quiz_id: int):
    try:
        quiz = QuizService.get_rejected_quiz_for_edit(quiz_id)
        return jsonify({
            "success": True,
            "data": quiz
        }), 200
    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to fetch rejected quiz: {str(e)}"
        }), 500


@quiz_bp.route("/edit/<int:quiz_id>", methods=["PUT"])
def edit_quiz(quiz_id: int):
    payload = request.get_json(silent=True)

    validation = validate_edit_quiz(payload)
    if not validation.ok:
        return jsonify({
            "success": False,
            "message": "Validation error",
            "errors": validation.errors
        }), 400

    if not payload:
        return jsonify({
            "success": False,
            "message": "Request body is required"
        }), 400

    try:
        result = QuizService.edit_quiz(quiz_id, payload)
        return jsonify({
            "success": True,
            "message": "Quiz updated successfully",
            "data": result
        }), 200

    except ValueError as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 400

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Failed to update quiz: {str(e)}"
        }), 500
