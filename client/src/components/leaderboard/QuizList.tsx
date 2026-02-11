import QuizListItem from "./QuizListItem";
import type { QuizListProps } from "../../types/leaderboard/QuizListProps";


export function QuizList({ quizzes, onViewLeaderboard }: QuizListProps) {
  if (quizzes.length === 0) {
    return (
      <div className="w-full text-gray-400 text-sm text-center py-6">
        No quizzes available.
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {quizzes.map((quiz) => (
        <QuizListItem
          key={quiz.id}
          quizId={quiz.id}
          quizName={quiz.name}
          onViewLeaderboard={onViewLeaderboard}
        />
      ))}
    </div>
  );
}

export default QuizList;
