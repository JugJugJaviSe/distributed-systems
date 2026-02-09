import type { QuizCatalogGridProps } from "../../types/player/QuizCatalogGridProps";

export function QuizCatalogGrid({
  items,
  formatDuration,
  onPlay,
}: QuizCatalogGridProps) {
  const formatDate = (value: string | Date) => {
    const d = new Date(value);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full max-w-5xl px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((q) => (
          <div
            key={q.id}
            className="rounded-xl bg-gray-800 p-4 flex flex-col gap-4 border border-gray-700"
          >
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-gray-100 line-clamp-2">
                {q.title}
              </h2>

              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{formatDuration(q.duration_seconds)}</span>
                {q.created_at && (
                  <span>{formatDate(q.created_at)}</span>
                )}
              </div>

              <div className="text-xs text-gray-500 truncate">
                {q.author_email}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onPlay(q.id)}
              className="
                mt-auto w-full py-2 rounded-lg
                bg-indigo-600 hover:bg-indigo-500
                text-white font-semibold text-sm
                transition-colors
              "
            >
              Play
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizCatalogGrid;
