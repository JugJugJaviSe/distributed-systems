from functools import wraps
from typing import Callable, Any

from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

from app.constants.user_roles import UserRole


def require_admin(fn: Callable[..., Any]) -> Callable[..., Any]:
    @wraps(fn)
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        try:
            verify_jwt_in_request()
        except Exception:
            return jsonify({
                "success": False,
                "message": "Unauthorized"
            }), 401

        identity = get_jwt_identity() or {}
        role = identity.get("role")

        if role != UserRole.ADMIN:
            return jsonify({
                "success": False,
                "message": "Forbidden (admin only)"
            }), 403

        return fn(*args, **kwargs)

    return wrapper