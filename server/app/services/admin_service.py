from multiprocessing import Process
from typing import List, Dict, Any
from app.models.user import User

from app.extensions import db
from app.constants.user_roles import UserRole
from app.services.mail_service import MailService

class AdminService:

    @staticmethod
    def list_all_users() -> List[Dict[str, Any]]:
        users = User.query.all()

        return [
            {
                "id": user.id,
                "email": user.email,
                "role": user.role,
                "created_at": user.created_at.isoformat()
                if getattr(user, "created_at", None)
                else None,
            }
            for user in users
        ]
    
    
    @staticmethod
    def change_user_role(user_id: int, new_role: UserRole) -> User:
        user = User.query.get(user_id)
        if not user:
            raise ValueError(f"User with ID {user_id} does not exist.")

        user.role = new_role.value
        db.session.commit()

        Process(target=MailService.send_role_change_email, args=(user.email, new_role)).start()     # Starting a separate process

        return user