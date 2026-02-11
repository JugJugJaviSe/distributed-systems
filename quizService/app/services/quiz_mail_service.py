from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from typing import Optional, List, Tuple
import os
from ..config import Config
import base64
import requests
from requests.auth import HTTPBasicAuth

MAILJET_API_KEY=Config.MAILJET_API_KEY
MAILJET_SECRET_KEY=Config.MAILJET_SECRET_KEY
MAILJET_FROM_EMAIL=Config.MAILJET_FROM_EMAIL
MAILJET_FROM_NAME=Config.MAILJET_FROM_NAME
MAILJET_URL=Config.MAILJET_URL

class QuizMailService:

    @staticmethod
    def send_email(
        to_email: str,
        subject: str,
        body: str,
        html: Optional[str] = None,
        attachments: Optional[List[Tuple[str, bytes]]] = None
    ):

        message = {
            "From": {
                "Email": Config.MAILJET_FROM_EMAIL,
                "Name": Config.MAILJET_FROM_NAME
            },
            "To": [
                {
                    "Email": to_email
                }
            ],
            "Subject": subject,
            "TextPart": body,
        }

        if html:
            message["HTMLPart"] = html

        if attachments:
            message["Attachments"] = []
            for filename, file_bytes in attachments:
                encoded = base64.b64encode(file_bytes).decode("utf-8")

                message["Attachments"].append({
                    "ContentType": "application/pdf",
                    "Filename": filename,
                    "Base64Content": encoded
                })

        payload = {
            "Messages": [message]
        }

        response = requests.post(
            MAILJET_URL,
            auth=HTTPBasicAuth(
                Config.MAILJET_API_KEY,
                Config.MAILJET_SECRET_KEY
            ),
            json=payload
        )

        response.raise_for_status()

        print(f"Email sent to {to_email} via Mailjet")

    @staticmethod
    def send_email_pdf(to_email: str, pdf_bytes: bytes, quiz_titles: list[str]):

        quiz_titles_str = ", ".join(quiz_titles)

        subject = "Quiz Attempts Report"
        body = (
            f"Hello,\n\n"
            f"You requested a report for the following quizzes: {quiz_titles_str}.\n"
            f"Attached you will find the PDF with all attempts for these quizzes.\n\n"
            f"Regards,\n"
            f"Quiz Platform Team"
        )

        html = f"""
            <p>Hello,</p>
            <p>You requested a report for the following quizzes: <b>{quiz_titles_str}</b>.</p>
            <p>Attached you will find the PDF with all attempts for these quizzes.</p>
            <p>Regards,<br/>Quiz Platform Team</p>
        """

        QuizMailService.send_email(
            to_email=to_email,
            subject=subject,
            body=body,
            html=html,
            attachments=[("quiz_attempts_report.pdf", pdf_bytes)]
        )


    @staticmethod
    def send_quiz_result_email(to_email: str, quiz_title: str, score: int, total_points: int, time_taken_seconds: int):
        subject = f"Your results for quiz: {quiz_title}"

        body = (
            f"Hello,\n\n"
            f"You have successfully finished the quiz \"{quiz_title}\".\n\n"
            f"Score: {score} / {total_points}\n"
            f"Time taken: {time_taken_seconds} seconds\n\n"
            f"Thank you for playing!\n"
            f"Quiz Platform Team"
        )

        html = f"""
            <p>Hello,</p>
            <p>You have successfully finished the quiz <b>{quiz_title}</b>.</p>
            <ul>
                <li><b>Score:</b> {score} / {total_points}</li>
                <li><b>Time taken:</b> {time_taken_seconds} seconds</li>
            </ul>
            <p>Thank you for playing!</p>
            <p>Quiz Platform Team</p>
        """

        QuizMailService.send_email(
            to_email=to_email,
            subject=subject,
            body=body,
            html=html
        )