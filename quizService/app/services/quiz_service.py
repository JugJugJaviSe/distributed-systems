from app.extensions import db
from app.models.quizzes import Quiz
from app.models.questions import Question
from app.models.answers import Answer
from typing import Dict

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


    @staticmethod
    def get_quiz(quiz_id: int):
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            raise ValueError("Quiz not found")

        if quiz.status != "approved":
            raise ValueError("Quiz is not available")

        questions = Question.query.filter_by(quiz_id=quiz_id).all()
        if not questions:
            raise ValueError("Quiz has no questions")

        question_list = []
        for q in questions:
            answers = Answer.query.filter_by(question_id=q.question_id).all()
            answer_list = [
                {"answer_id": a.answer_id, "text": a.answer_text}
                for a in answers
            ]
            question_list.append({
                "question_id": q.question_id,
                "text": q.question_text,
                "points": q.points,
                "answers": answer_list
            })

        return {
            "quiz_id": quiz.quiz_id,
            "title": quiz.title,
            "duration_seconds": quiz.duration_seconds,
            "questions": question_list
        }
    
    @staticmethod
    def get_quiz_titles(quiz_ids:list[str]) -> list[Dict[str, str]]:
        quizzes = Quiz.query.filter(Quiz.quiz_id.in_(quiz_ids)).all()
        return [{"id": q.quiz_id, "title": q.title} for q in quizzes]