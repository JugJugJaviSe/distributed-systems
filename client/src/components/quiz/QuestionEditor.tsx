import type { QuizQuestionDto } from "../../models/quiz/QuizQuestionDto";
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
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-4 shadow-sm">
            <div className="space-y-1">
                <label className="block text-gray-300 font-medium text-sm">Question Text</label>
                <input
                    value={question.text}
                    onChange={(e) => onChange({ ...question, text: e.target.value })}
                    placeholder="Enter the question text"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div className="space-y-1">
                <label className="block text-gray-300 font-medium text-sm">Points</label>
                <input
                    type="number"
                    value={question.points}
                    onChange={(e) => onChange({ ...question, points: Number(e.target.value) })}
                    placeholder="Enter points for this question"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min={0}
                />
            </div>

            <div className="space-y-3">
                {question.answers.map((a, i) => (
                    <AnswerEditor
                        key={i}
                        answer={a}
                        onChange={(val) => updateAnswer(i, val)}
                    />
                ))}
            </div>

            <div>
                <button
                    onClick={() =>
                        onChange({
                            ...question,
                            answers: [...question.answers, { text: "", is_correct: false }],
                        })
                    }
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow transition-colors duration-200 text-sm"
                >
                    Add Answer
                </button>
            </div>
        </div>
    );
}
