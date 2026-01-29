import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuthHook";
import { ProfileCard } from "../../components/profile_card/ProfileCard";
import type { ICloudinariImageAPIService } from "../../api_services/cloudinary_image_api/ICloudinaryImageAPIService";
import type { IUsersAPIService } from "../../api_services/users_api/IUsersAPIService";
import type { IQuizAPIService } from "../../api_services/quiz_api/IQuizAPIService";
import type { ModeratorNotification } from "../../types/moderator/ModeratorNotification";
import { ModeratorInbox } from "../../components/moderator/ModeratorInbox";
import { ModeratorTable } from "../../components/moderator/ModeratorTable";
import { useSocket } from "../../contextsts/SocketContext";

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
    const { logout } = useAuth();
    const navigate = useNavigate();
    const socket = useSocket();

    const [showProfile, setShowProfile] = useState(false);

    const [notifications, setNotifications] = useState<ModeratorNotification[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
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

        return () => {
            socket.off("quiz_rejected", handleQuizRejected);
        };
    }, [socket]);

    const logoutHandler = () => {
        logout();
        navigate("/login");
    };

    const toggleProfile = () => {
        setShowProfile(prev => !prev);
    };

    return (
        <div className="min-h-screen w-full bg-gray-900 text-gray-100 p-6 flex flex-col items-center space-y-6">
            <div className="w-full flex justify-between items-center">
                <h1 className="text-3xl font-bold">Welcome to moderator dashboard!</h1>

                <ModeratorInbox
                    notifications={notifications}
                    onOpenQuiz={(quizId: number) =>
                        navigate(`/quiz/edit/${quizId}`)
                    }
                />
            </div>

            <div className="flex gap-4">
                <button onClick={toggleProfile} className="px-6 py-3 bg-gray-700 rounded">
                    {showProfile ? "Hide Profile" : "Show Profile"}
                </button>

                <button onClick={logoutHandler} className="px-6 py-3 bg-red-600 rounded">
                    Log out
                </button>

                <button
                    onClick={() => navigate("/quiz/create")}
                    className="px-6 py-3 bg-green-600 rounded"
                >
                    Create Quiz
                </button>
            </div>

            <ModeratorTable quizApi={quizApi} />

            {showProfile && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <ProfileCard
                        setShowProfile={setShowProfile}
                        cloudinaryApi={cloudinaryApi}
                        usersApi={usersApi}
                    />
                </div>
            )}
        </div>
    );
}
