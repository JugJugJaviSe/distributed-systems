import type{ DashboardHeaderProps } from "../../types/player/DashboardHeaderProps";

export function DashboardHeader({
  title,
  page,
  totalPages,
  canPrev,
  canNext,
  loading,
  onPrev,
  onNext,
}: DashboardHeaderProps) {
  return (
    <div className="w-full max-w-5xl px-6 flex items-center justify-between">
      <h1 className="text-3xl font-bold text-gray-100">{title}</h1>

      <div className="flex items-center gap-3 text-gray-100">
        <span className="text-sm">
          Page <span className="font-semibold">{page}</span> /{" "}
          <span className="font-semibold">{totalPages}</span>
        </span>

        <button
          type="button"
          onClick={onPrev}
          disabled={!canPrev || loading}
          className="px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!canNext || loading}
          className="px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default DashboardHeader;
