from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, date
from typing import Any, Dict, Optional, Set
import re


# -------------------------
# Constants
# -------------------------

ALLOWED_PROFILE_FIELDS: Set[str] = {
    "first_name",
    "last_name",
    "date_of_birth",
    "gender",
    "email",
    "country",
    "street",
    "street_number",
}

_EMAIL_RE = re.compile(r"^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$")


# -------------------------
# DTO
# -------------------------

@dataclass
class ValidationResult:
    ok: bool
    data: Dict[str, Any]
    errors: Dict[str, Any]


# -------------------------
# Helpers
# -------------------------

def _is_non_empty_string(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def _is_valid_email(value: str) -> bool:
    return bool(_EMAIL_RE.match(value))


def _parse_date_yyyy_mm_dd(value: str) -> Optional[date]:
    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except Exception:
        return None


# -------------------------
# Validator
# -------------------------

def validate_patch_me(payload: Any) -> ValidationResult:
    # Basic payload checks
    if payload is None:
        return ValidationResult(
            ok=False,
            data={},
            errors={"payload": "Missing JSON body"},
        )

    if not isinstance(payload, dict):
        return ValidationResult(
            ok=False,
            data={},
            errors={"payload": "Invalid JSON body. Expected object."},
        )

    if not payload:
        return ValidationResult(
            ok=False,
            data={},
            errors={"payload": "No changes provided"},
        )

    # Unknown fields
    unknown_fields = set(payload.keys()) - ALLOWED_PROFILE_FIELDS
    if unknown_fields:
        return ValidationResult(
            ok=False,
            data={},
            errors={"unknown_fields": sorted(unknown_fields)},
        )

    data: Dict[str, Any] = {}
    errors: Dict[str, Any] = {}

    for key, value in payload.items():
        # -------------------------
        # String fields
        # -------------------------
        if key in {
            "first_name",
            "last_name",
            "gender",
            "email",
            "country",
            "street",
            "street_number",
        }:
            if value is None:
                data[key] = None
                continue

            if not _is_non_empty_string(value):
                errors[key] = "Must be a non-empty string"
                continue

            cleaned = value.strip()

            if key == "email":
                if not _is_valid_email(cleaned):
                    errors[key] = "Invalid email format"
                    continue
                cleaned = cleaned.lower()

            data[key] = cleaned
            continue

        # -------------------------
        # Date field
        # -------------------------
        if key == "date_of_birth":
            if value is None:
                data[key] = None
                continue

            if not isinstance(value, str):
                errors[key] = "Must be a string in YYYY-MM-DD format"
                continue

            parsed = _parse_date_yyyy_mm_dd(value.strip())
            if not parsed:
                errors[key] = "Invalid format. Use YYYY-MM-DD"
                continue

            data[key] = parsed
            continue

        # Should never happen (defensive)
        errors[key] = "Field not allowed"

    if errors:
        return ValidationResult(ok=False, data={}, errors=errors)

    return ValidationResult(ok=True, data=data, errors={})
