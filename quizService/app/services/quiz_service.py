from app.extensions import db
from app.models.quiz import Quiz
from app.models.question import Question
from app.models.answer import Answer


class QuizService:
    @staticmethod
    def create_quiz(data):
        quiz = Quiz(
            title=data["title"],
            duration=data["duration"],
            author_id=data["author_id"],
            status="PENDING",
        )

        db.session.add(quiz)
        db.session.flush()

        for q in data["questions"]:
            question = Question(
                quiz_id=quiz.id,
                text=q["text"],
                points=q["points"],
            )
            db.session.add(question)
            db.session.flush()

            for a in q["answers"]:
                answer = Answer(
                    question_id=question.id,
                    text=a["text"],
                    is_correct=a["is_correct"],
                )
                db.session.add(answer)

        db.session.commit()

        return {
            "success": True,
            "message": "Quiz created successfully",
            "data": {
                "quiz_id": quiz.id,
                "status": quiz.status,
            },
            "status": 201,
        }
