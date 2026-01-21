from multiprocessing import Process
from flask import Blueprint, jsonify, request
from ..services.quiz_mail_service import QuizMailService
from ..services.quiz_pdf_service import PDFService
from flask_jwt_extended import jwt_required, get_jwt

quiz_mail_bp = Blueprint("quiz_mail", __name__, url_prefix="/quiz-mail")

@quiz_mail_bp.route("/reports", methods=["POST"])
@jwt_required()
def generate_report():
    claims = get_jwt()
    current_user_email = claims.get("email")

    data = request.get_json()
    quizzes = data.get("quizzes")
    users = data.get("users")
    attempts = data.get("attempts")

    if not quizzes or not isinstance(quizzes, list):
        return jsonify({"error": "quiz_ids must be a list"}), 400
    
    if not users or not isinstance(users, list):
        return jsonify({"error": "users must be a list"}), 400
    
    if not attempts or not isinstance(attempts, list):
        return jsonify({"error": "attempts must be a list"}), 400

    file_path = PDFService.generate_report(quizzes, users, attempts)
    print(file_path)

    Process(target=QuizMailService.send_email_pdf, args=(current_user_email, file_path, [q["title"] for q in quizzes])).start()


    return jsonify({
        "message": "Reports generation started",
        "quizzes": quizzes
    })
