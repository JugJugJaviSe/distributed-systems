from app.extensions import db

class Question(db.Model):
    __tablename__ = "questions"

    question_id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, nullable=False)

    question_text = db.Column(db.String(1000), nullable=False)
    points = db.Column(db.Integer, nullable=False)