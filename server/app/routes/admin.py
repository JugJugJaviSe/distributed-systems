from flask import Blueprint, request, jsonify
from app.middlewares.require_role import require_role
from app.constants.user_roles import UserRole
from app.services.admin_service import AdminService
from app.models.user import User
from app.extensions import db 

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")


@admin_bp.get("/users")
@require_role([UserRole.ADMIN])
def list_users():
    users = AdminService.list_all_users()

    return jsonify({
        "success": True,
        "data": users
    }), 200