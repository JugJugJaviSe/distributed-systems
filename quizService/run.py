import os
from app import create_app
from app.models import quizzes, questions, answers, quiz_attempts
from app.extensions import db
#comment for testing workflow
app = create_app()

if os.getenv("AUTO_CREATE_TABLES", "false").lower() == "true":
    with app.app_context():
        db.create_all()

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8001")),
        debug=True,
    )
