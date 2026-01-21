import { useState } from "react";
import type { QuizAnswer, QuizQuestion } from "../../types/quiz/GetQuizResponses";

interface QuizQuestionCardProps {
    question: QuizQuestion;
    onAnswerSelect: (answerId: number) => void;
    selectedAnswerId?: number;
}

export function QuizQuestionCard({
    question,
    onAnswerSelect,
    selectedAnswerId,
}: QuizQuestionCardProps) {
    const [hoveredAnswer, setHoveredAnswer] = useState<number | null>(null);

    return (
        <div className="w-full max-w-2xl p-6 bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-100">{question.text}</h2>
                <span className="text-gray-400 text-sm">{question.points} pts</span>
            </div>

            <div className="flex flex-col gap-3">
                {question.answers.map((answer: QuizAnswer) => {
                    const isSelected = selectedAnswerId === answer.answer_id;
                    const isHovered = hoveredAnswer === answer.answer_id;

                    return (
                        <button
                            key={answer.answer_id}
                            onClick={() => onAnswerSelect(answer.answer_id)}
                            onMouseEnter={() => setHoveredAnswer(answer.answer_id)}
                            onMouseLeave={() => setHoveredAnswer(null)}
                            className={`
                                w-full text-left px-5 py-3 border rounded-lg transition-all duration-150
                                ${isSelected ? "bg-blue-600 text-white border-blue-500 shadow-md" : ""}
                                ${!isSelected && isHovered ? "bg-gray-700/80 border-gray-500" : "bg-gray-700 border-gray-600 text-gray-100"}
                            `}
                        >
                            {answer.text}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}