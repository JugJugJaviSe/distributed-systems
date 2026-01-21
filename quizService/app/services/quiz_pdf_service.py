from typing import Dict
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from datetime import datetime
import os

# from app.models.quiz import Quiz
# from app.models.attempt import Attempt

class PDFService:

    @staticmethod
    def generate_report(quizzes: list[Dict[str, str]], admin_email: str, users: list[Dict[str, str]], attempts: list[Dict[str, str]]) -> str:
        os.makedirs("reports", exist_ok=True)

        # print(quiz_ids)
        # print(admin_email)
        # print(users)
        # print(attempts)        

        file_path = "reports/quiz_attempts_report.pdf"
        c = canvas.Canvas(file_path, pagesize=A4)
        width, height = A4

        y = height - 50

        c.setFont("Helvetica-Bold", 18)
        c.drawString(50, y, "Quiz Attempts Report")
        y -= 30

        c.setFont("Helvetica", 10)
        c.drawString(50, y, f"Generated at: {datetime.now().replace(microsecond=0)}")
        y -= 40

        for quiz in quizzes:

            quiz_title = f"Quiz #{quiz['id']} - {quiz['title']}"
            quiz_attempts = [a for a in attempts if a["quiz_id"] == quiz["id"]]

            # Page break if needed
            if y < 150:
                c.showPage()
                y = height - 50

            # Quiz header
            c.setFont("Helvetica-Bold", 14)
            c.drawString(50, y, f"{quiz_title}")
            y -= 20

            c.setFont("Helvetica", 10)
            c.drawString(50, y, "-" * 147)
            y -= 20

            # Table header
            c.setFont("Helvetica-Bold", 10)
            c.drawString(50, y, "Player ID")
            c.drawString(120, y, "Player email")
            c.drawString(250, y, "Started at")
            c.drawString(350, y, "Finished at")
            c.drawString(450, y, "Score")
            c.drawString(500, y, "Time (s)")
            y -= 15

            c.setFont("Helvetica", 10)

            for a in quiz_attempts:
                if y < 80:
                    c.showPage()
                    y = height - 50

                c.drawString(50, y, str(a["player_id"]))
                player_email = next((u["email"] for u in users if u["id"] == a["player_id"]),"N/A")
                c.drawString(120, y, str(player_email))
                c.drawString(250, y, str(a["started_at"]))
                c.drawString(350, y, str(a["finished_at"]))
                c.drawString(450, y, str(a["score"]))
                c.drawString(500, y, str(a["time_taken_seconds"]))
                y -= 15

            y -= 30  # space between quizzes

        c.save()
        return file_path
