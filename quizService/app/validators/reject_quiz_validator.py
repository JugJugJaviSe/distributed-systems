from types import SimpleNamespace

def validate_reject_quiz(payload):
    errors = {}

    if not payload:
        errors["payload"] = "Payload required"

    if not payload.get("comment"):
        errors["comment"] = "Reject comment is required"

    if errors:
        return SimpleNamespace(ok=False, errors=errors)

    return SimpleNamespace(ok=True, data=payload)
