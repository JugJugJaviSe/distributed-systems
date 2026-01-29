from types import SimpleNamespace

def validate_create_quiz(payload):
    errors = {}

    if not payload:
        return SimpleNamespace(ok=False, errors={"payload": "Payload required"})

    # Title
    if not payload.get("title") or not str(payload.get("title")).strip():
        errors["title"] = "Title required"

    # Duration
    if not isinstance(payload.get("duration"), int):
        errors["duration"] = "Duration must be integer"

    # Author ID
    if not payload.get("author_id"):
        errors["author_id"] = "Author ID required"

    # Questions
    questions = payload.get("questions", [])
    if len(questions) == 0:
        errors["questions"] = "At least 1 question required"

    for i, q in enumerate(questions):
        # Question text
        if not q.get("text") or not str(q.get("text")).strip():
            errors[f"questions[{i}].text"] = "Question text required"

        # Points
        if not isinstance(q.get("points"), int):
            errors[f"questions[{i}].points"] = "Points must be integer"

        # Answers
        answers = q.get("answers", [])
        if len(answers) < 2:
            errors[f"questions[{i}].answers"] = "At least 2 answers required"
        else:
            # At least 1 correct
            if not any(a.get("is_correct") is True for a in answers):
                errors[f"questions[{i}].answers"] = "At least one correct answer required"

            # Each answer must have text
            for j, a in enumerate(answers):
                if not a.get("text") or not str(a.get("text")).strip():
                    errors[f"questions[{i}].answers[{j}].text"] = "Answer text required"

    if errors:
        return SimpleNamespace(ok=False, errors=errors)

    return SimpleNamespace(ok=True, data=payload)
