import { useEffect, useState } from "react";
import type { GetQuizResponseData } from "../../types/quiz/GetQuizResponses";
import { quizApi } from "../../api_services/quiz_api/QuizAPIService";
import { useAuth } from "../../hooks/UseAuthHook";

type Props = {
    quizId: number;
    onClose: () => void;
    onApprove: (comment: string) => Promise<void>;
    onReject: (comment: string) => Promise<void>;
};

export function QuizReviewModal({
    quizId,
    onClose,
    onApprove,
    onReject,
}: Props) {
    const { token } = useAuth();

    const [quiz, setQuiz] = useState<GetQuizResponseData | null>(null);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadQuiz = async () => {
            try {
                const res = await quizApi.getQuizForAdmin(token!, quizId);

                if (!res.success || !res.data) {
                    setError(res.message || "Failed to load quiz");
                    return;
                }

                setQuiz(res.data);
            } catch (e) {
                console.error(e);
                setError("Error while loading quiz");
            } finally {
                setLoading(false);
            }
        };

        if (quizId && token) {
            loadQuiz();
        }
    }, [quizId, token]);

    const handleApprove = async () => {

        try {
            setSubmitting(true);
            await onApprove(comment);
        } catch {
            alert("Approve failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!comment.trim()) {
            alert("Comment is required when rejecting a quiz");
            return;
        }

        try {
            setSubmitting(true);
            await onReject(comment);
        } catch {
            alert("Reject failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-gray-800 p-6 rounded text-white">
                    Loading quiz details...
                </div>
            </div>
        );
    }

    if (error || !quiz) {
        return (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-gray-800 p-6 rounded max-w-md">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 w-full max-w-4xl rounded-xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{quiz.title}</h2>
                        <p className="text-gray-400 mt-2">{quiz.description}</p>
                        <div className="flex gap-3 mt-3">
                            <span className="bg-gray-800 px-3 py-1 rounded text-sm text-gray-300">
                                {quiz.duration_seconds}s
                            </span>
                            <span className="bg-gray-800 px-3 py-1 rounded text-sm text-gray-300">
                                {quiz.questions.length} questions
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        X
                    </button>
                </div>

                <div className="space-y-4 mb-6">
                    {quiz.questions.map((q, qi) => (
                        <div
                            key={`question-${q.question_id}-${qi}`}
                            className="bg-gray-800 border border-gray-700 rounded p-4"
                        >
                            <div className="text-white font-semibold mb-2">
                                {qi + 1}. {q.text}
                                <span className="ml-2 text-green-400">
                                    ({q.points} pts)
                                </span>
                            </div>

                            <div className="space-y-2">
                                {q.answers.map((a, ai) => (
                                    <div
                                        key={`answer-${a.answer_id}-${ai}`}
                                        className="p-2 bg-gray-700 rounded text-gray-300"
                                    >
                                        {a.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mb-6">
                    <label className="block text-gray-300 mb-2">
                        Admin comment (required for rejection)
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white"
                        rows={4}
                        placeholder="Write feedback..."
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-700 rounded text-white"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={submitting}
                        onClick={handleReject}
                        className="px-4 py-2 bg-red-600 rounded text-white disabled:opacity-50"
                    >
                        Reject
                    </button>
                    <button
                        disabled={submitting}
                        onClick={handleApprove}
                        className="px-4 py-2 bg-green-600 rounded text-white disabled:opacity-50"
                    >
                        Approve
                    </button>
                </div>
            </div>
        </div>
    );
}
