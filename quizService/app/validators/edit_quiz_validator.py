from types import SimpleNamespace

def validate_edit_quiz(payload):
    errors = {}

    if not payload:
        return SimpleNamespace(ok=False, errors={"payload": "Payload required"})

    questions = payload.get("questions", [])

    for i, q in enumerate(questions):
        qid = q.get("question_id") or q.get("id")
        if not qid:
            errors[f"questions[{i}].id"] = "Question id missing"

        if not q.get("text"):
            errors[f"questions[{i}].text"] = "Text required"

        if not isinstance(q.get("points"), int):
            errors[f"questions[{i}].points"] = "Points must be integer"

        answers = q.get("answers", [])
        if len(answers) < 2:
            errors[f"questions[{i}].answers"] = "At least 2 answers required"
        else:
            if not any(a.get("is_correct") is True for a in answers):
                errors[f"questions[{i}].answers"] = "At least one correct answer required"

        for j, a in enumerate(answers):
            aid = a.get("answer_id") or a.get("id")
            if not aid:
                errors[f"questions[{i}].answers[{j}].id"] = "Answer id missing"

            if not a.get("text"):
                errors[f"questions[{i}].answers[{j}].text"] = "Answer text required"

    if errors:
        return SimpleNamespace(ok=False, errors=errors)

    return SimpleNamespace(ok=True, data=payload)
