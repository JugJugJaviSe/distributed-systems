import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/UseAuthHook";
import { Navbar } from "../../components/navbar/Navbar";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { DashboardHeader } from "../../components/player_dashboard/DashboardHeader";
import { CatalogState } from "../../components/player_dashboard/CatalogState";

import QuizList from "../../components/leaderboard/QuizList";
import { quizApi } from "../../api_services/quiz_api/QuizAPIService";
import type { QuizCatalogItem } from "../../models/quizCatalog/QuizCatalog";

export function LeaderboardHomePage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [items, setItems] = useState<QuizCatalogItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const pageSize = 8;

  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const canPrev = useMemo(() => page > 1, [page]);
  const canNext = useMemo(() => page < totalPages, [page, totalPages]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!token) {
        setItems([]);
        setTotalPages(1);
        setErrorMsg("You are not authenticated.");
        return;
      }

      setLoading(true);
      setErrorMsg("");

      try {
        // Uses the same catalog source as PlayerDashboard
        const res = await quizApi.getCatalog(token, page, pageSize);

        if (cancelled) return;

        if (!res.success || !res.data) {
          setItems([]);
          setTotalPages(1);
          setErrorMsg(res.message || "Failed to load quizzes.");
          return;
        }

        setItems(res.data.items ?? []);
        setTotalPages(res.data.total_pages ?? 1);
      } catch (e: any) {
        if (!cancelled) {
          setItems([]);
          setTotalPages(1);
          setErrorMsg(e?.message || "Failed to load quizzes.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [token, page]);

  const onPrev = () => setPage((p) => Math.max(1, p - 1));
  const onNext = () => setPage((p) => Math.min(totalPages, p + 1));

  const onViewLeaderboard = (quizId: number) => {
    navigate(`/dashboard/quizzes/${quizId}/leaderboard`);
  };

  return (
    <DashboardLayout navbar={<Navbar />}>
      <DashboardHeader
        title="Leaderboards"
        page={page}
        totalPages={totalPages}
        canPrev={canPrev}
        canNext={canNext}
        loading={loading}
        onPrev={onPrev}
        onNext={onNext}
      />

      <CatalogState
        loading={loading}
        errorMsg={errorMsg}
        isEmpty={!loading && !errorMsg && items.length === 0}
      />

      {!loading && !errorMsg && items.length > 0 && (
        <div className="w-full max-w-5xl px-6">
          {/* one quiz = one row */}
          <QuizList
            quizzes={items.map((q) => ({
              id: q.id,
              name: q.title,
            }))}
            onViewLeaderboard={onViewLeaderboard}
          />
        </div>
      )}
    </DashboardLayout>
  );
}

export default LeaderboardHomePage;
