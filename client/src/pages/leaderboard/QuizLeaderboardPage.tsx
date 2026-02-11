import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Navbar } from "../../components/navbar/Navbar";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { DashboardHeader } from "../../components/player_dashboard/DashboardHeader";

import { quizApi } from "../../api_services/quiz_api/QuizAPIService";
import type { LeaderboardAttemptDto } from "../../types/leaderboard/LeaderboardAttemptDto";

export function QuizLeaderboardPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const parsedQuizId = Number(quizId);

  const [items, setItems] = useState<LeaderboardAttemptDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  const totalPages = useMemo(() => {
    const pages = Math.ceil(items.length / pageSize);
    return pages <= 0 ? 1 : pages;
  }, [items.length]);

  const canPrev = useMemo(() => page > 1, [page]);
  const canNext = useMemo(() => page < totalPages, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page]);

  useEffect(() => {
    if (!Number.isFinite(parsedQuizId) || parsedQuizId <= 0) {
      setErrorMsg("Invalid quiz id.");
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setErrorMsg("");

      const res = await quizApi.getLeaderboard(parsedQuizId);

      if (cancelled) return;

      if (!res.success || !res.data) {
        setItems([]);
        setErrorMsg(res.message || "Failed to load leaderboard.");
        setLoading(false);
        return;
      }

      setItems(res.data);
      setPage(1);
      setLoading(false);
    };

    load();

    return () => {
      cancelled = true as unknown as boolean;
    };
  }, [parsedQuizId]);

  const onPrev = () => setPage((p) => Math.max(1, p - 1));
  const onNext = () => setPage((p) => Math.min(totalPages, p + 1));

  const formatSeconds = (seconds: number) => {
    if (!Number.isFinite(seconds)) return "-";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return (
    <DashboardLayout navbar={<Navbar />}>
      <div className="w-full max-w-5xl px-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-100">Leaderboard</h1>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-gray-100 font-semibold"
          >
            Back
          </button>
        </div>
      </div>

      <DashboardHeader
        title={`Quiz`}
        page={page}
        totalPages={totalPages}
        canPrev={canPrev}
        canNext={canNext}
        loading={loading}
        onPrev={onPrev}
        onNext={onNext}
      />

      {loading && (
        <p className="text-gray-400 px-6 py-4">Loading leaderboard...</p>
      )}

      {!loading && errorMsg && (
        <p className="text-red-500 px-6 py-4">{errorMsg}</p>
      )}

      {!loading && !errorMsg && items.length === 0 && (
        <p className="text-gray-400 px-6 py-4">No attempts yet.</p>
      )}

      {!loading && !errorMsg && items.length > 0 && (
        <div className="w-full max-w-5xl px-6">

          <div className="overflow-x-auto rounded-xl ring-1 ring-gray-700 bg-gray-900 shadow-lg">
            <table className="min-w-full border-separate border-spacing-0">
                <thead className="bg-gray-800">
                <tr>
                    {/* Bigger header height */}
                    <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Rank
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Player
                    </th>
                    <th className="px-6 py-5 text-right text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Score
                    </th>
                    <th className="px-6 py-5 text-right text-xs font-semibold uppercase tracking-wider text-gray-300">
                    Time
                    </th>
                </tr>
                </thead>

                <tbody>
                {pageItems.map((a, idx) => {
                    const rank = (page - 1) * pageSize + idx + 1;

                    return (
                    <tr
                        key={`${a.player_id}-${idx}`}
                        className={`${
                        idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800/60"
                        } hover:bg-gray-800 transition-colors`}
                    >
                        {/* Bigger body rows */}
                        <td className="px-6 py-6 text-base font-semibold text-gray-200">
                        #{rank}
                        </td>

                        <td className="px-6 py-6 text-base font-medium text-gray-100">
                        Player {a.player_id}
                        </td>

                        <td className="px-6 py-6 text-base text-right font-semibold text-gray-100">
                        {a.score}
                        </td>

                        <td className="px-6 py-6 text-base text-right text-gray-400">
                        {formatSeconds(a.time_taken_seconds)}
                        </td>
                    </tr>
                    );
                })}
                </tbody>
            </table>
            </div>


          
        </div>
      )}
    </DashboardLayout>
  );
}

export default QuizLeaderboardPage;
