from app.extensions import db
from datetime import datetime
from app.constants.quiz_status import QuizStatus

class Quiz(db.Model):
    __tablename__ = "quizzes"

    quiz_id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(255), nullable=False)
    author_id = db.Column(db.Integer, nullable=False)  # User ID from another service

    duration_seconds = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default=QuizStatus.PENDING.value)  # pending | approved | rejected
    rejection_reason = db.Column(db.String(500), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)