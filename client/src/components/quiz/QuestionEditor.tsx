import type { QuizQuestionDto } from "../../types/quiz/QuizQuestionDto";
import { AnswerEditor } from "./AnswerEditor";

interface Props {
    question: QuizQuestionDto;
    onChange: (q: QuizQuestionDto) => void;
}

export function QuestionEditor({ question, onChange }: Props) {
    const updateAnswer = (i: number, value: any) => {
        const answers = [...question.answers];
        answers[i] = value;
        onChange({ ...question, answers });
    };

    return (
        <div className="border p-4 rounded space-y-2">
            <input
                value={question.text}
                onChange={e => onChange({ ...question, text: e.target.value })}
                placeholder="Question text"
                className="w-full p-2 border rounded"
            />

            <input
                type="number"
                value={question.points}
                onChange={e =>
                    onChange({ ...question, points: Number(e.target.value) })
                }
                className="w-full p-2 border rounded"
            />

            {question.answers.map((a, i) => (
                <AnswerEditor
                    key={i}
                    answer={a}
                    onChange={val => updateAnswer(i, val)}
                />
            ))}

            <button
                onClick={() =>
                    onChange({
                        ...question,
                        answers: [...question.answers, { text: "", is_correct: false }],
                    })
                }
                className="text-sm text-blue-600"
            >
                + Add answer
            </button>
        </div>
    );
}
