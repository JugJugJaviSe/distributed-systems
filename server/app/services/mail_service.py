import os
import base64
from typing import Optional
import requests
from requests.auth import HTTPBasicAuth
from flask import current_app
from ..config import Config
from app.constants.user_roles import UserRole


class MailService:

    @staticmethod
    def send_email(
        to_email: str,
        subject: str,
        body: str,
        html: Optional[str] = None
    ):
        """Send an email via Mailjet API."""

        try:
            url = Config.MAILJET_URL or "https://api.mailjet.com/v3.1/send"

            message = {
                "From": {
                    "Email": Config.MAILJET_FROM_EMAIL,
                    "Name": Config.MAILJET_FROM_NAME
                },
                "To": [{"Email": to_email}],
                "Subject": subject,
                "TextPart": body
            }

            if html:
                message["HTMLPart"] = html

            payload = {"Messages": [message]}

            response = requests.post(
                url,
                auth=HTTPBasicAuth(Config.MAILJET_API_KEY, Config.MAILJET_SECRET_KEY),
                json=payload,
                timeout=10
            )

            response.raise_for_status()

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
