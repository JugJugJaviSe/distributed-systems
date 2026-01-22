import requests
from app.config import Config

class QuizService:
    @staticmethod
    def get_all_quizzes_from_quizService():
        url = f"{Config.QUIZ_SERVICE_BASE_URL}quiz/getAll"
        res = requests.get(url)
        res.raise_for_status()
        return res.json()