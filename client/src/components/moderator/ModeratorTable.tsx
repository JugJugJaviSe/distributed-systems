import { useEffect, useState } from "react";
import type { ModeratorTableProps } from "../../types/moderator/ModeratorTableProps";
import type { QuizFromList } from "../../types/quiz/QuizFromList";
import { useAuth } from "../../hooks/UseAuthHook";

export function ModeratorTable({ quizApi }: ModeratorTableProps) {
    const [quizzes, setQuizzes] = useState<QuizFromList[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { token } = useAuth();

    useEffect(() => {
        async function fetchMyQuizzes() {
            try {
                const res = await quizApi.getMyQuizzes(token!);
                if (res.success && res.data) {
                    setQuizzes(res.data);
                } else {
                    setError(res.message);
                }
            } catch (e: any) {
                setError(e.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        }

        if (token) {
            fetchMyQuizzes();
        }
    }, [quizApi, token]);

    const handleDeleteQuiz = async (quizId: string) => {
        if (!token) return;

        const confirmDelete = window.confirm("Are you sure you want to delete this quiz?");
        if (!confirmDelete) return;

        try {
            const res = await quizApi.deleteQuiz(parseInt(quizId, 10), token);

            if (res.success) {
                setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
            } else {
                alert(res.message || "Delete failed");
            }
        } catch (err: any) {
            console.error(err);
            alert("Error deleting quiz");
        }
    };

    if (loading) return <p className="text-gray-500">Loading quizzes...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse shadow-lg rounded-lg overflow-hidden">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="px-6 py-3 text-left uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-left uppercase tracking-wider">Duration (s)</th>
                        <th className="px-6 py-3 text-left uppercase tracking-wider">Created At</th>
                        <th className="px-6 py-3 text-left uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white">
                    {quizzes.map((quiz, idx) => (
                        <tr
                            key={quiz.id}
                            className={`
                                ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} 
                                hover:bg-gray-100 transition-colors duration-200
                            `}
                        >
                            <td className="px-6 py-4 text-gray-500">{quiz.id}</td>
                            <td className="px-6 py-4 font-medium text-gray-700">{quiz.title}</td>
                            <td className="px-6 py-4 text-gray-500">{quiz.duration_seconds}</td>
                            <td className="px-6 py-4 text-gray-500">{quiz.created_at}</td>
                            <td className="px-6 py-4 text-gray-600">{quiz.status}</td>
                            <td className="px-6 py-4 text-center">
                                <button
                                    onClick={() => handleDeleteQuiz(quiz.id)}
                                    className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
