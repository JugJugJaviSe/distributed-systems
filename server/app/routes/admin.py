import flask import Blueprint, request, jsonify
from app.middlewares.require_admin import require_admin
from app.models.user import User
from app.extensions import db 

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")


@admin_bp.get("/users")
@require_admin
def list_users():
    users = AdminService.list_all_users()

    return jsonify({
        "success": True,
        "data": users
    }), 200