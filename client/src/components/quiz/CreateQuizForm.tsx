import { useState } from "react";
import { useAuth } from "../../hooks/UseAuthHook";
import type { QuizQuestionDto } from "../../types/quiz/QuizQuestionDto";
import type { CreateQuizDto } from "../../types/quiz/CreateQuizDto";
import type { CreateQuizPageProps } from "../../types/quiz/CreateQuizPageProps";
import { QuestionEditor } from "./QuestionEditor";

export function CreateQuizForm({ quizApi }: CreateQuizPageProps) {
    const { user } = useAuth();

    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState(60);
    const [questions, setQuestions] = useState<QuizQuestionDto[]>([]);

    const addQuestion = () => {
        setQuestions(prev => [
            ...prev,
            {
                text: "",
                points: 1,
                answers: [
                    { text: "", is_correct: false },
                    { text: "", is_correct: false },
                ],
            },
        ]);
    };

    const validateQuiz = (): boolean => {
        if (!title.trim()) {
            alert("Quiz title is required");
            return false;
        }

        if (questions.length === 0) {
            alert("Quiz must have at least one question");
            return false;
        }

        for (const q of questions) {
            if (!q.text.trim()) {
                alert("Each question must have text");
                return false;
            }

            if (q.answers.length < 2) {
                alert("Each question must have at least 2 answers");
                return false;
            }

            if (!q.answers.some(a => a.is_correct)) {
                alert("Each question must have at least one correct answer");
                return false;
            }
        }

        return true;
    };

    const submitQuiz = async () => {
        if (!user) return;
        if (!validateQuiz()) return;

        const payload: CreateQuizDto = {
            title,
            duration,
            author_id: user.id,
            questions,
        };

        try {
            await quizApi.createQuiz(payload);
            alert("Quiz created and sent for admin approval.");
            setTitle("");
            setDuration(60);
            setQuestions([]);
        } catch {
            alert("Error while creating quiz");
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold">Create quiz</h1>

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
                <QuestionEditor
                    key={index}
                    question={q}
                    onChange={updated => {
                        const copy = [...questions];
                        copy[index] = updated;
                        setQuestions(copy);
                    }}
                />
            ))}

            <button
                onClick={addQuestion}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Add question
            </button>

            <button
                onClick={submitQuiz}
                className="px-4 py-2 bg-green-600 text-white rounded"
            >
                Save quiz
            </button>
        </div>
    );
}
