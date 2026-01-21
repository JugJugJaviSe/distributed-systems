interface QuizFinishProps {
    score: number;
    totalQuestions: number;
    timeTakenSeconds: number;
    onRetry?: () => void;
    onBackToList?: () => void;
}

export function QuizFinish({
    score,
    totalQuestions,
    timeTakenSeconds,
    onRetry,
    onBackToList,
}: QuizFinishProps) {
    const minutes = Math.floor(timeTakenSeconds / 60);
    const seconds = timeTakenSeconds % 60;

    return (
        <div className="w-full max-w-2xl p-6 bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 text-center">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Quiz Finished!</h2>

            <p className="text-gray-300 text-lg mb-2">
                Score: <span className="font-semibold text-blue-400">{score}</span> / {totalQuestions}
            </p>

            <p className="text-gray-400 mb-6">
                Time Taken: {minutes}m {seconds}s
            </p>

            <div className="flex justify-center gap-4">
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        Retry
                    </button>
                )}

                {onBackToList && (
                    <button
                        onClick={onBackToList}
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        Back to Quiz List
                    </button>
                )}
            </div>
        </div>
    );
}