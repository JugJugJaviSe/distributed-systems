import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from dotenv import load_dotenv

from app.constants.user_roles import UserRole

load_dotenv()

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

class MailService:    

    @staticmethod
    def send_email(to_email: str, subject: str, body: str, html: Optional[str] = None):
        msg = MIMEMultipart("alternative")      # Alternative formats of same content (plain text and HTML) - Email clients will pick the version they can display
        msg["From"] = SMTP_USER
        msg["To"] = to_email
        msg["Subject"] = subject

        # Attach plain text
        part1 = MIMEText(body, "plain")
        msg.attach(part1)

        # Attach HTML if provided
        if html:
            part2 = MIMEText(html, "html")
            msg.attach(part2)

        # Connect and send
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.send_message(msg)
            print(f"Email sent to {to_email} with subject '{subject}'")

    @staticmethod
    def send_role_change_email(user_email: str, new_role: UserRole):
        subject = "Role Update Notification"
        body = f"Hello,\n\nYour role on the platform has been updated to: {new_role.value}.\n\nRegards,\nQuiz Platform Team"
        html = f"<p>Hello,</p><p>Your role on the platform has been updated to: <b>{new_role.value}</b>.</p><p>Regards,<br/>Quiz Platform Team</p>"

        MailService.send_email(to_email=user_email, subject=subject, body=body, html=html)