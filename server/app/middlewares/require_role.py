from functools import wraps
from typing import Callable, Any, Iterable

from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt


def require_role(allowed_roles: Iterable[str]):
    allowed = set(allowed_roles)

    def decorator(fn: Callable[..., Any]) -> Callable[..., Any]:
        @wraps(fn)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            try:
                verify_jwt_in_request()
            except Exception:
                return jsonify({"success": False, "message": "Unauthorized"}), 401

            claims = get_jwt()
            role = claims.get("role")

            if role not in allowed:
                return jsonify({"success": False, "message": "Forbidden"}), 403

            return fn(*args, **kwargs)

        return wrapper

    return decorator
