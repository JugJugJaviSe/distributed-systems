from app.extensions import db

class PlayerAnswer(db.Model):
    __tablename__ = "player_answers"

    player_answer_id = db.Column(db.Integer, primary_key=True)
    attempt_id = db.Column(db.Integer, nullable=False)
    question_id = db.Column(db.Integer, nullable=False)
    answer_id = db.Column(db.Integer, nullable=False)
    is_correct = db.Column(db.Boolean, nullable=True)