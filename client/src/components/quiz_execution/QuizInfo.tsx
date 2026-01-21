interface QuizInfoProps {
    title: string;
    durationSeconds: number;
    totalQuestions: number;
}

export function QuizInfo({ title, durationSeconds, totalQuestions }: QuizInfoProps) {
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = durationSeconds % 60;

    return (
        <div className="w-full max-w-2xl p-6 bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 mb-6">
            <h1 className="text-2xl font-bold text-gray-100 mb-2">{title}</h1>
            <div className="flex justify-between text-gray-400 text-sm">
                <span>Duration: {minutes}min {seconds}s</span>
                <span>Total Questions: {totalQuestions}</span>
            </div>
        </div>
    );
}