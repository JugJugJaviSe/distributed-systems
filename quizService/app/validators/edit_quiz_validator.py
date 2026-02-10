from types import SimpleNamespace

def validate_edit_quiz(payload):
    errors = {}

    if not payload:
        return SimpleNamespace(ok=False, errors={"payload": "Payload required"})

    questions = payload.get("questions", [])
    if len(questions) == 0:
        errors["questions"] = "At least 1 question required"

    for i, q in enumerate(questions):
        # question_id can be None/missing for newly added questions
        qid = q.get("question_id")
        if qid is not None and not isinstance(qid, int):
            errors[f"questions[{i}].question_id"] = "Question id must be integer or null"

        if not q.get("text") or not str(q.get("text")).strip():
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
            # answer_id can be None/missing for newly added answers
            aid = a.get("answer_id")
            if aid is not None and not isinstance(aid, int):
                errors[f"questions[{i}].answers[{j}].answer_id"] = "Answer id must be integer or null"

            if not a.get("text") or not str(a.get("text")).strip():
                errors[f"questions[{i}].answers[{j}].text"] = "Answer text required"

    if errors:
        return SimpleNamespace(ok=False, errors=errors)

    return SimpleNamespace(ok=True, data=payload)