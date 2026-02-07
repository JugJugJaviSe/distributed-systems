import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSocket } from "../../contextsts/SocketContext";
import { Navbar } from "../../components/navbar/Navbar";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import { ProfileCard } from "../../components/profile_card/ProfileCard";

import { ModeratorInbox } from "../../components/moderator/ModeratorInbox";
import { ModeratorTable } from "../../components/moderator/ModeratorTable";

import type { ICloudinariImageAPIService } from "../../api_services/cloudinary_image_api/ICloudinaryImageAPIService";
import type { IUsersAPIService } from "../../api_services/users_api/IUsersAPIService";
import type { IQuizAPIService } from "../../api_services/quiz_api/IQuizAPIService";
import type { ModeratorNotification } from "../../types/moderator/ModeratorNotification";

interface ModeratorDashboardProps {
  cloudinaryApi: ICloudinariImageAPIService;
  usersApi: IUsersAPIService;
  quizApi: IQuizAPIService;
}

const STORAGE_KEY = "moderator_notifications";

export default function ModeratorDashboard({
  cloudinaryApi,
  usersApi,
  quizApi,
}: ModeratorDashboardProps) {
  const navigate = useNavigate();
  const socket = useSocket();

  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState<ModeratorNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as ModeratorNotification[]) : [];
  });

  useEffect(() => {
    if (!socket) return;

    const handleQuizRejected = (data: ModeratorNotification) => {
      setNotifications((prev) => {
        const updated = [data, ...prev];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    };

    socket.on("quiz_rejected", handleQuizRejected);

    // socket.off returns the socket instance; wrap to ensure cleanup returns void.
    return () => {
      socket.off("quiz_rejected", handleQuizRejected);
    };
  }, [socket]);

  return (
    <DashboardLayout navbar={<Navbar onProfileClick={() => setShowProfile(true)} />}>
      <div className="w-full max-w-5xl px-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-100">Quizzes</h1>

        <ModeratorInbox
          notifications={notifications}
          onOpenQuiz={(quizId: number) => navigate(`/quiz/edit/${quizId}`)}
        />
      </div>

      <div className="w-full max-w-5xl px-6">
        <ModeratorTable quizApi={quizApi} />
      </div>

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
