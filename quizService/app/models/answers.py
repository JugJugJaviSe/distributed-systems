from app.extensions import db

class Answer(db.Model):
    __tablename__ = "answers"

    answer_id = db.Column(db.Integer, primary_key=True)
    question_id = db.Column(db.Integer, db.ForeignKey("questions.question_id"), nullable=False)

    answer_text = db.Column(db.String(1000), nullable=False)
    is_correct = db.Column(db.Boolean, default=False)