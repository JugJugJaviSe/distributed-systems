import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/UseAuthHook";
import type { EditQuizFormProps } from "../../types/quiz/EditQuizFormProps";

type EditAnswer = {
    answer_id: number;
    text: string;
    is_correct: boolean;
};

type EditQuestion = {
    question_id: number;
    text: string;
    points: number;
    answers: EditAnswer[];
};

const STORAGE_KEY = "moderator_notifications";

export default function EditQuizForm({ quizId, quizApi, onSaved }: EditQuizFormProps) {
    const { token } = useAuth();

    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState<number>(0);
    const [questions, setQuestions] = useState<EditQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<string[]>([]);

    useEffect(() => {
        if (!token) return;

        const loadQuiz = async () => {
            const res = await quizApi.getRejectedQuiz(token, quizId);

            if (!res.success || !res.data) {
                setError(res.message || "Failed to load quiz");
                return;
            }

            const quiz = res.data;
            setTitle(quiz.title);
            setDuration(quiz.duration_seconds);

            const mappedQuestions: EditQuestion[] = quiz.questions.map((q: any) => ({
                question_id: q.id,
                text: q.text,
                points: q.points,
                answers: q.answers.map((a: any) => ({
                    answer_id: a.id,
                    text: a.text,
                    is_correct: a.is_correct,
                })),
            }));

            setQuestions(mappedQuestions);
            setLoading(false);
        };

        loadQuiz();
    }, [quizId, quizApi, token]);

    const validateQuiz = (): boolean => {
        if (!title.trim()) return false;
        if (questions.length === 0) return false;

        for (const q of questions) {
            if (!q.text.trim()) return false;
            if (q.answers.length < 2) return false;
            if (!q.answers.some(a => a.is_correct)) return false;
        }

        return true;
    };

    const handleSave = async () => {
        if (!token) return;

        setFormErrors([]);

        if (!validateQuiz()) {
            setFormErrors(["Please fill in all fields and mark at least one correct answer."]);
            return;
        }

        const payload = { title, duration, questions };
        const res = await quizApi.editQuiz(token, quizId, payload);

        if (!res.success) {
            if (res.errors) {
                const messages = Object.values(res.errors);
                setFormErrors(messages as string[]);
            } else {
                setFormErrors([res.message || "Failed to update quiz"]);
            }
            return;
        }

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            const updated = parsed.filter((n: any) => n.quiz_id !== quizId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }

        onSaved();
    };

    if (loading) return <p className="text-gray-300">Loading quiz...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="max-w-5xl mx-auto px-6 space-y-6">
            <div className="space-y-1">
                <label className="block text-gray-300 font-medium text-sm">Quiz Title</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter quiz title"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div className="space-y-1">
                <label className="block text-gray-300 font-medium text-sm">Duration (minutes)</label>
                <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    placeholder="Enter duration in minutes"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    min={1}
                />
            </div>

            <div className="space-y-4">
                {questions.map((q, index) => (
                    <div key={q.question_id} className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-3 shadow-sm">
                        <div className="space-y-1">
                            <label className="block text-gray-300 font-medium text-sm">Question Text</label>
                            <input
                                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={q.text}
                                onChange={e => {
                                    const copy = [...questions];
                                    copy[index] = { ...q, text: e.target.value };
                                    setQuestions(copy);
                                }}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-gray-300 font-medium text-sm">Points</label>
                            <input
                                type="number"
                                className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={q.points}
                                onChange={e => {
                                    const copy = [...questions];
                                    copy[index] = { ...q, points: Number(e.target.value) };
                                    setQuestions(copy);
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            {q.answers.map((a, aIndex) => (
                                <div key={a.answer_id} className="flex items-center gap-2">
                                    <input
                                        className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={a.text}
                                        onChange={e => {
                                            const copy = [...questions];
                                            copy[index].answers[aIndex] = { ...a, text: e.target.value };
                                            setQuestions(copy);
                                        }}
                                    />
                                    <label className="flex items-center gap-1 text-gray-300">
                                        <input
                                            type="checkbox"
                                            checked={a.is_correct}
                                            onChange={e => {
                                                const copy = [...questions];
                                                copy[index].answers[aIndex] = { ...a, is_correct: e.target.checked };
                                                setQuestions(copy);
                                            }}
                                            className="w-4 h-4 rounded border-gray-600 bg-gray-800 focus:ring-2 focus:ring-indigo-500"
                                        />
                                        Correct
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Errors */}
            {formErrors.length > 0 && (
                <div className="bg-gray-900 border border-red-600 text-red-400 p-4 rounded-lg shadow-sm">
                    {formErrors.map((err, i) => (
                        <p key={i} className="text-sm">• {err}</p>
                    ))}
                </div>
            )}

            <div className="flex justify-end mt-4">
                <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow transition-colors duration-200"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}