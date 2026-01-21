import { useEffect, useState } from "react";

interface QuizTimerProps {
    durationSeconds: number;
    onTimeUp: () => void;
}

export function QuizTimer({ durationSeconds, onTimeUp }: QuizTimerProps) {
    const [timeLeft, setTimeLeft] = useState(durationSeconds);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp();
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, onTimeUp]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="w-full max-w-xs p-3 bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-700 shadow-md text-center mb-4">
            <p className="text-gray-100 font-semibold">
                Time left:{" "}
                <span className="text-blue-400">
                    {minutes}:{seconds.toString().padStart(2, "0")}
                </span>
            </p>
        </div>
    );
}