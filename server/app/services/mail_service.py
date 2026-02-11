import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from flask import current_app

from app.constants.user_roles import UserRole


class MailService:

    @staticmethod
    def send_email(
        to_email: str,
        subject: str,
        body: str,
        html: Optional[str] = None
    ):
        try:
            smtp_host = os.getenv("SMTP_HOST")
            smtp_port = int(os.getenv("SMTP_PORT", "587"))
            smtp_user = os.getenv("SMTP_USER")
            smtp_password = os.getenv("SMTP_PASSWORD")

            if not smtp_host or not smtp_user or not smtp_password:
                raise RuntimeError(
                    "SMTP configuration missing: "
                    "SMTP_HOST / SMTP_USER / SMTP_PASSWORD"
                )

            msg = MIMEMultipart("alternative")
            msg["From"] = smtp_user
            msg["To"] = to_email
            msg["Subject"] = subject

            # Plain text
            msg.attach(MIMEText(body, "plain"))

            # Optional HTML
            if html:
                msg.attach(MIMEText(html, "html"))

            with smtplib.SMTP(smtp_host, smtp_port, timeout=20) as server:
                server.ehlo()
                server.starttls()
                server.ehlo()
                server.login(smtp_user, smtp_password)
                server.send_message(msg)

            current_app.logger.info(
                f"Email successfully sent to {to_email} | subject='{subject}'"
            )

        except Exception as e:
            current_app.logger.exception(
                f"Failed to send email to {to_email} | subject='{subject}'"
            )
            raise

    @staticmethod
    def send_role_change_email(user_email: str, new_role: UserRole):
        subject = "Role Update Notification"
        body = (
            "Hello,\n\n"
            f"Your role on the platform has been updated to: {new_role.value}.\n\n"
            "Regards,\nQuiz Platform Team"
        )
        html = (
            "<p>Hello,</p>"
            "<p>Your role on the platform has been updated to: "
            f"<b>{new_role.value}</b>.</p>"
            "<p>Regards,<br/>Quiz Platform Team</p>"
        )

        MailService.send_email(
            to_email=user_email,
            subject=subject,
            body=body,
            html=html
        )
