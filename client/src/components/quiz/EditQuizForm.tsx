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
                question_id: q.question_id,
                text: q.text,
                points: q.points,
                answers: q.answers.map((a: any) => ({
                    answer_id: a.answer_id,
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
        if (!validateQuiz()) return;

        const payload = { title, duration, questions };

        const res = await quizApi.editQuiz(token, quizId, payload);

        if (!res.success) {
            alert(res.message || "Failed to update quiz");
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold">Edit quiz</h1>

            <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Quiz title"
                className="w-full p-2 border rounded"
            />

            <input
                type="number"
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full p-2 border rounded"
            />

            {questions.map((q, index) => (
                <div key={q.question_id} className="border p-4 rounded">
                    <input
                        className="w-full p-2 border mb-2"
                        value={q.text}
                        onChange={e => {
                            const copy = [...questions];
                            copy[index] = { ...q, text: e.target.value };
                            setQuestions(copy);
                        }}
                    />

                    <input
                        type="number"
                        className="w-full p-2 border mb-2"
                        value={q.points}
                        onChange={e => {
                            const copy = [...questions];
                            copy[index] = { ...q, points: Number(e.target.value) };
                            setQuestions(copy);
                        }}
                    />

                    {q.answers.map((a, aIndex) => (
                        <div key={a.answer_id} className="flex items-center gap-2 mb-1">
                            <input
                                className="flex-1 p-2 border"
                                value={a.text}
                                onChange={e => {
                                    const copy = [...questions];
                                    copy[index].answers[aIndex] = {
                                        ...a,
                                        text: e.target.value,
                                    };
                                    setQuestions(copy);
                                }}
                            />
                            <input
                                type="checkbox"
                                checked={a.is_correct}
                                onChange={e => {
                                    const copy = [...questions];
                                    copy[index].answers[aIndex] = {
                                        ...a,
                                        is_correct: e.target.checked,
                                    };
                                    setQuestions(copy);
                                }}
                            />
                            <span>Correct</span>
                        </div>
                    ))}
                </div>
            ))}

            <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded"
            >
                Save changes
            </button>
        </div>
    );
}
