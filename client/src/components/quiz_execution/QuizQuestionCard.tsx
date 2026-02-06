import { useState } from "react";
import type { QuizAnswer, QuizQuestion } from "../../types/quiz/GetQuizResponses";

interface QuizQuestionCardProps {
    question: QuizQuestion;
    onSubmit: (answerIds: number[]) => void;
}

export function QuizQuestionCard({ question, onSubmit }: QuizQuestionCardProps) {
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [hoveredAnswer, setHoveredAnswer] = useState<number | null>(null);

    const toggleAnswer = (answerId: number) => {
        setSelectedAnswers(prev =>
            prev.includes(answerId)
                ? prev.filter(id => id !== answerId)
                : [...prev, answerId]
        );
    };

    const handleSubmit = () => {
        if (selectedAnswers.length === 0) return;
        onSubmit(selectedAnswers);
        setSelectedAnswers([]);     // Reset for next question
    };

    return (
        <div className="w-full max-w-2xl p-6 bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-100">
                    {question.text}
                </h2>
                <span className="text-gray-400 text-sm">
                    {question.points} pts
                </span>
            </div>

            <div className="flex flex-col gap-3 mb-6">
                {question.answers.map((answer: QuizAnswer) => {
                    const isSelected = selectedAnswers.includes(answer.answer_id);
                    const isHovered = hoveredAnswer === answer.answer_id;

                    return (
                        <button
                            key={answer.answer_id}
                            type="button"
                            onClick={() => toggleAnswer(answer.answer_id)}
                            onMouseEnter={() => setHoveredAnswer(answer.answer_id)}
                            onMouseLeave={() => setHoveredAnswer(null)}
                            className={`
                                w-full text-left px-5 py-3 border rounded-lg transition-all duration-150
                                ${isSelected ? "bg-blue-600 text-white border-blue-500 shadow-md" : ""}
                                ${!isSelected && isHovered ? "bg-gray-700/80 border-gray-500" : ""}
                                ${!isSelected && !isHovered ? "bg-gray-700 border-gray-600 text-gray-100" : ""}
                            `}
                        >
                            {answer.text}
                        </button>
                    );
                })}
            </div>

            <button
                onClick={handleSubmit}
                disabled={selectedAnswers.length === 0}
                className={`
                    w-full py-3 rounded-lg font-semibold transition
                    ${selectedAnswers.length === 0
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700 text-white"}
                `}
            >
                Submit
            </button>
        </div>
    );
}