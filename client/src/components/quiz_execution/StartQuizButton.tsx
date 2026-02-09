import { useState } from "react";

interface StartQuizButtonProps {
    onStart: () => Promise<void>;
}

export function StartQuizButton({ onStart }: StartQuizButtonProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleStart = async () => {
        setLoading(true);
        setError("");
        try {
            await onStart();
        } catch (err: any) {
            setError(err.message || "Failed to start quiz");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mb-6">
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button
                onClick={handleStart}
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            >
                {loading ? "Starting..." : "Start Quiz"}
            </button>
        </div>
    );
}