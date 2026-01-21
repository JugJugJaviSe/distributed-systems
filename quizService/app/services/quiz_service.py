from app.extensions import db
from app.models.quizzes import Quiz
from app.models.questions import Question
from app.models.answers import Answer


class QuizService:
    @staticmethod
    def create_quiz(data):
        quiz = Quiz(
            title=data["title"],
            duration_seconds=data["duration"],
            author_id=data["author_id"],
            status="PENDING",
        )

        db.session.add(quiz)
        db.session.flush()  

        for q in data["questions"]:
            question = Question(
                quiz_id=quiz.quiz_id,          
                question_text=q["text"],       
                points=q["points"],
            )
            db.session.add(question)
            db.session.flush() 

            for a in q["answers"]:
                answer = Answer(
                    question_id=question.question_id,  
                    answer_text=a["text"],             
                    is_correct=a["is_correct"],
                )
                db.session.add(answer)

        db.session.commit()

        quiz_dto = QuizService.quiz_to_dto(quiz)

        return {
            "success": True,
            "message": "Quiz created successfully",
            "data": quiz_dto,
            "status": 201,
        }

    @staticmethod
    def quiz_to_dto(quiz: Quiz):
        return {
            "id": quiz.quiz_id,   
            "title": quiz.title,
            "duration_seconds": quiz.duration_seconds,
            "author_id": quiz.author_id,
            "status": quiz.status,
            "questions": [
                {
                    "id": q.question_id,        
                    "text": q.question_text,   
                    "points": q.points,
                    "answers": [
                        {
                            "id": a.answer_id,        
                            "text": a.answer_text,   
                            "is_correct": a.is_correct
                        } for a in q.answers
                    ]
                } for q in quiz.questions
            ]
        }
