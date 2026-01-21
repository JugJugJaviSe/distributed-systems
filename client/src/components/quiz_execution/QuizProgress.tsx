interface QuizProgressProps {
    answered: number;
    total: number;
}

export function QuizProgress({ answered, total }: QuizProgressProps) {
    const progressPercentage = Math.min((answered / total) * 100, 100);

    return (
        <div className="w-full max-w-2xl mb-6">
            <div className="flex justify-between mb-1 text-gray-300 text-sm">
                <span>Progress</span>
                <span>
                    {answered} / {total} answered
                </span>
            </div>
            <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
                <div
                    className="h-3 bg-blue-600 transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
        </div>
    );
}
