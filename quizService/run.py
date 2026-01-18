from app import create_app
from app.models import quizzes, questions, answers, quiz_attempts, player_answers

app = create_app()

from app.extensions import db

with app.app_context():
    db.create_all()     # Generates tables inside schema

if __name__ == "__main__":
    app.run(debug=True, port=5001)
