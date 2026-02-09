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
    try:
        if get_jwt()["role"] != UserRole.MODERATOR.value:
            return jsonify({
                "success": False,
                "message": "Forbidden"
            }), 403

        response = requests.post(
            QUIZ_SERVICE_BASE_URL,
            json=request.json,
            timeout=5
        )

        try:
            data = response.json()
        except ValueError:
            data = {
                "success": False,
                "message": "Invalid response from quiz service"
            }

        if response.status_code != 201:
            return jsonify(data), response.status_code

        quiz = data.get("data", data)

        # real-time admin notification
        socketio.emit("quiz_created", quiz, room="admins")

        return jsonify(data), 201

    except requests.RequestException:
        return jsonify({
            "success": False,
            "message": "Quiz service is unreachable"
        }), 503

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Server error while creating quiz: {str(e)}"
        }), 500



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
    
@quiz_bp.get("/approvedQuizzes")
@require_auth
def get_approved_quizzes():
    try:
        quizzes = QuizService.get_approved_quizzes_from_quizService()

        users = UserService.get_all_user_emails()
        id_to_email = {user["id"]: user["email"] for user in users}

        for quiz in quizzes["data"]:
            author_id = quiz.pop("author_id", None)
            quiz["author_email"] = id_to_email.get(author_id, "unknown@example.com")

        return jsonify(quizzes), 200

    except requests.exceptions.RequestException as e:
        return jsonify({"success": False, "message": str(e)}), 500
    

@quiz_bp.get("/pendingQuizzes")
@require_auth
def get_pending_quizzes():
    try:
        quizzes = QuizService.get_pending_quizzes_from_quizService()

        users = UserService.get_all_user_emails()
        id_to_email = {user["id"]: user["email"] for user in users}

        for quiz in quizzes["data"]:
            author_id = quiz.pop("author_id", None)
            quiz["author_email"] = id_to_email.get(author_id, "unknown@example.com")

        return jsonify(quizzes), 200

    except requests.exceptions.RequestException as e:
        return jsonify({"success": False, "message": str(e)}), 500
    

@quiz_bp.get("/catalog")
@require_auth
def get_catalog():
    try:
        page = request.args.get("page", 1, type=int)
        page_size = request.args.get("page_size", 12, type=int)

        catalog = QuizService.get_catalog_from_quizService(page=page, page_size=page_size)

        data = catalog.get("data", {})
        items = data.get("items", [])

        users = UserService.get_all_user_emails()
        id_to_email = {user["id"]: user["email"] for user in users}

        for quiz in items:
            author_id = quiz.pop("author_id", None)
            quiz["author_email"] = id_to_email.get(author_id, "unknown@example.com")

        return jsonify(catalog), 200

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


@quiz_bp.route("/admin/<int:quiz_id>/approve", methods=["PUT"])
@require_auth
@require_role([UserRole.ADMIN])
def approve_quiz(quiz_id):
    try:
        response = requests.put(
            f"{QUIZ_SERVICE_BASE_URL}/admin/{quiz_id}/approve",
            json=request.json,
            timeout=5
        )

        return jsonify(response.json()), response.status_code

    except requests.RequestException:
        return jsonify({
            "success": False,
            "message": "Quiz service is unreachable"
        }), 503

@quiz_bp.route("/admin/<int:quiz_id>/reject", methods=["PUT"])
@require_auth
@require_role([UserRole.ADMIN])
def reject_quiz(quiz_id):
    data = request.get_json()

    if not data or not data.get("comment"):
        return jsonify({
            "success": False,
            "message": "Comment is required"
        }), 400

    try:
        response = requests.put(
            f"{QUIZ_SERVICE_BASE_URL}/admin/{quiz_id}/reject",
            json=data,
            timeout=5
        )
        quiz_data = response.json()

        data = quiz_data.get("data", {})
        author_id = data.get("author_id")
        comment = data.get("admin_comment")

        if author_id:
            socketio.emit(
                "quiz_rejected",
                {
                    "quiz_id": quiz_id,
                    "comment": comment,
                    "message": "Your quiz was rejected by admin"
                },
                room=f"user_{author_id}"
            )
        return jsonify(response.json()), response.status_code

    except requests.RequestException:
        return jsonify({
            "success": False,
            "message": "Quiz service is unreachable"
        }), 503

@quiz_bp.route("/delete/<int:quiz_id>", methods=["OPTIONS"])
def delete_quiz_options(quiz_id):
    return "", 200 

@quiz_bp.route("/delete/<int:quiz_id>", methods=["DELETE"])
@require_auth
@require_role([UserRole.ADMIN, UserRole.MODERATOR])
def delete_quiz(quiz_id):
    try:
        response = requests.delete(
            f"{QUIZ_SERVICE_BASE_URL}/delete/{quiz_id}",
            timeout=5
        )

        try:
            data = response.json()
        except ValueError:
            data = {
                "success": False,
                "message": "Invalid response from quizService"
            }

        return jsonify(data), response.status_code

    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Server error while deleting quiz: {str(e)}"
        }), 500

@quiz_bp.get("/my")
@require_auth
@require_role([UserRole.MODERATOR])
def get_my_quizzes():
    try:
        user_id = get_jwt_identity()

        response = requests.get(
            f"{QUIZ_SERVICE_BASE_URL}/my/{user_id}",
            timeout=10
        )

        return jsonify(response.json()), response.status_code

    except requests.exceptions.RequestException as e:
        return jsonify({"success": False, "message": str(e)}), 500


@quiz_bp.route("/getRejected/<int:quiz_id>", methods=["GET"])
@require_auth
@require_role([UserRole.MODERATOR])
def get_rejected_quiz_for_moderator(quiz_id: int):
    try:
        response = requests.get(
            f"{QUIZ_SERVICE_BASE_URL}/getRejected/{quiz_id}",
            timeout=10
        )

        return jsonify(response.json()), response.status_code

    except requests.RequestException:
        return jsonify({
            "success": False,
            "message": "Quiz service is unreachable"
        }), 503


@quiz_bp.route("/edit/<int:quiz_id>", methods=["PUT"])
@require_auth
@require_role([UserRole.MODERATOR])
def edit_quiz(quiz_id: int):
    try:
        response = requests.put(
            f"{QUIZ_SERVICE_BASE_URL}/edit/{quiz_id}",
            json=request.json,
            timeout=10
        )
        quiz_data = response.json()
        if response.status_code == 200 and quiz_data.get("success"):
            quiz = quiz_data.get("data", {})

            socketio.emit("quiz_created", quiz, room="admins")
        
        return jsonify(response.json()), response.status_code

    except requests.RequestException:
        return jsonify({
            "success": False,
            "message": "Quiz service is unreachable"
        }), 503