import type { CatalogStateProps } from "../../types/player/CatalogStateProps";
export function CatalogState({
  loading,
  errorMsg,
  isEmpty,
}: CatalogStateProps) {
  if (loading) {
    return (
      <div className="w-full max-w-5xl px-6 text-center text-gray-300">
        Loading quizzes…
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="w-full max-w-5xl px-6 text-center text-red-400">
        {errorMsg}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="w-full max-w-5xl px-6 text-center text-gray-400">
        No quizzes available.
      </div>
    );
  }

  return null;
}

export default CatalogState;