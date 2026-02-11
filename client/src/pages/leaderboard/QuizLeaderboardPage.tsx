import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Navbar } from "../../components/navbar/Navbar";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { DashboardHeader } from "../../components/player_dashboard/DashboardHeader";

import type { LeaderboardAttemptDto } from "../../types/leaderboard/LeaderboardAttemptDto";
import { QuizLeaderboardTable } from "../../components/leaderboard/QuizLeaderboardTable";
import type { ICloudinariImageAPIService } from "../../api_services/cloudinary_image_api/ICloudinaryImageAPIService";
import type { IUsersAPIService } from "../../api_services/users_api/IUsersAPIService";
import type { IQuizAPIService } from "../../api_services/quiz_api/IQuizAPIService";
import { ProfileCard } from "../../components/profile_card/ProfileCard";

interface QuizLeaderboardPageProps {
  cloudinaryApi: ICloudinariImageAPIService;
  usersApi: IUsersAPIService;
  quizApi: IQuizAPIService;
}

export function QuizLeaderboardPage({ cloudinaryApi, usersApi, quizApi, }: QuizLeaderboardPageProps) {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const parsedQuizId = Number(quizId);

  const [items, setItems] = useState<LeaderboardAttemptDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [showProfile, setShowProfile] = useState(false);

  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  const totalPages = useMemo(() => {
    const pages = Math.ceil(items.length / pageSize);
    return pages <= 0 ? 1 : pages;
  }, [items.length, pageSize]);

  const canPrev = useMemo(() => page > 1, [page]);
  const canNext = useMemo(() => page < totalPages, [page, totalPages]);

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
    <DashboardLayout navbar={<Navbar onProfileClick={() => setShowProfile(true)} />}>
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
        title={``}
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

      {!loading && !errorMsg && (
        <QuizLeaderboardTable
          items={items}
          page={page}
          pageSize={pageSize}
          formatSeconds={formatSeconds}
        />
      )}

      {showProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <ProfileCard
            setShowProfile={setShowProfile}
            cloudinaryApi={cloudinaryApi}
            usersApi={usersApi}
          />
        </div>
      )}
    </DashboardLayout>
  );
}

export default QuizLeaderboardPage;