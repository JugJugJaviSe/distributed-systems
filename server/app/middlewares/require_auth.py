from functools import wraps
from typing import Callable, Any
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request


def require_auth(fn: Callable[..., Any]) -> Callable[..., Any]:
    @wraps(fn)
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        try:
            verify_jwt_in_request()
        except Exception:
            return jsonify({"success": False, "message": "Unauthorized"}), 401

        return fn(*args, **kwargs)

    return wrapper
