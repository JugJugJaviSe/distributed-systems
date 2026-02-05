import requests
from app.config import Config

class QuizService:
    @staticmethod
    def get_all_quizzes_from_quizService():
        url = f"{Config.QUIZ_SERVICE_BASE_URL}quiz/getAll"
        res = requests.get(url)
        res.raise_for_status()
        return res.json()
    
    @staticmethod
    def get_catalog_from_quizService(page: int = 1, page_size: int = 12):
        url = f"{Config.QUIZ_SERVICE_BASE_URL}quiz/catalog"
        res = requests.get(url, params={"page": page, "page_size": page_size})
        res.raise_for_status()
        return res.json()