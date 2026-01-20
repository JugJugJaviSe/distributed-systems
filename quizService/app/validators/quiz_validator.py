from types import SimpleNamespace


def validate_create_quiz(payload):
    errors = {}

    if not payload:
        errors["payload"] = "Payload is required"
        return SimpleNamespace(ok=False, errors=errors)

    if not payload.get("title"):
        errors["title"] = "Title is required"

    if not isinstance(payload.get("duration"), int):
        errors["duration"] = "Duration must be integer"

    if not payload.get("author_id"):
        errors["author_id"] = "Author ID is required"

    questions = payload.get("questions")
    if not questions or not isinstance(questions, list):
        errors["questions"] = "Questions must be a list"

    else:
        for i, q in enumerate(questions):
            if not q.get("text"):
                errors[f"questions[{i}].text"] = "Question text is required"

            if not isinstance(q.get("points"), int):
                errors[f"questions[{i}].points"] = "Points must be integer"

            answers = q.get("answers")
            if not answers or len(answers) < 2:
                errors[f"questions[{i}].answers"] = "At least 2 answers required"

            else:
                correct_answers = [
                    a for a in answers if a.get("is_correct") is True
                ]
                if not correct_answers:
                    errors[f"questions[{i}].answers"] = (
                        "At least one correct answer required"
                    )

    if errors:
        return SimpleNamespace(ok=False, errors=errors)

    return SimpleNamespace(ok=True, data=payload)
