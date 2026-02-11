import type { QuizListItemProps } from "../../types/leaderboard/QuizListItemProps";

export function QuizListItem({
  quizId,
  quizName,
  onViewLeaderboard,
}: QuizListItemProps) {
  return (
    <div className="w-full flex items-center justify-between bg-gray-800 border border-gray-700 rounded-xl px-5 py-4">
      {/* Quiz name */}
      <span className="text-gray-100 font-semibold text-base">
        {quizName}
      </span>

      {/* View leaderboard button */}
      <button
        type="button"
        onClick={() => onViewLeaderboard(quizId)}
        className="
          px-4 py-2 rounded-lg
          bg-indigo-600 hover:bg-indigo-700
          transition-colors
          text-white font-semibold
        "
      >
        View leaderboard
      </button>
    </div>
  );
}

export default QuizListItem;
