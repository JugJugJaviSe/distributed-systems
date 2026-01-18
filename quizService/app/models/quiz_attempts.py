from app.extensions import db
from datetime import datetime
from app.constants.attempt_status import AttemptStatus

class QuizAttempt(db.Model):
    __tablename__ = "quiz_attempts"

    attempt_id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, nullable=False)
    player_id = db.Column(db.Integer, nullable=False)  # User ID from another service

    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    finished_at = db.Column(db.DateTime, nullable=True)

    status = db.Column(db.String(20), default=AttemptStatus.IN_PROGRESS.value)  # in_progress | submitted | processed
    score = db.Column(db.Integer, nullable=True)
    time_taken_seconds = db.Column(db.Integer, nullable=True)  # Can be calculated from finished_at - started_at