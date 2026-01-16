from typing import List, Dict, Any
from app.models.user import User

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
