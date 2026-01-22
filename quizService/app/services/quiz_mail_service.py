from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from typing import Optional, List, Tuple
import os
import smtplib
from ..config import Config

SMTP_USER = Config.SMTP_USER
SMTP_HOST = Config.SMTP_HOST
SMTP_PORT = Config.SMTP_PORT
SMTP_PASSWORD = Config.SMTP_PASSWORD

class QuizMailService:

    @staticmethod
    def send_email(
        to_email: str,
        subject: str,
        body: str,
        html: Optional[str] = None,
        attachments: Optional[List[Tuple[str, bytes]]] = None
    ):

        msg = MIMEMultipart("mixed")
        msg["From"] = SMTP_USER
        msg["To"] = to_email
        msg["Subject"] = subject

        alt_part = MIMEMultipart("alternative")
        alt_part.attach(MIMEText(body, "plain"))
        if html:
            alt_part.attach(MIMEText(html, "html"))

        msg.attach(alt_part)

        if attachments:
            for filename, file_bytes in attachments:
                part = MIMEApplication(file_bytes, _subtype="octet-stream")
                part.add_header("Content-Disposition", "attachment", filename=filename)
                msg.attach(part)

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
            print(f"Email sent to {to_email} with subject '{subject}'")

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