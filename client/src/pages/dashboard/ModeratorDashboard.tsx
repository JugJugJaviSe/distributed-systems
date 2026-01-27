import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuthHook";
import { ProfileCard } from "../../components/profile_card/ProfileCard";
import type { ICloudinariImageAPIService } from "../../api_services/cloudinary_image_api/ICloudinaryImageAPIService";
import type { IUsersAPIService } from "../../api_services/users_api/IUsersAPIService";
import type { ModeratorNotification } from "../../types/moderator/ModeratorNotification";
import { connectModeratorSocket, disconnectModeratorSocket } from "../../sockets/moderatorSocket";
import { ModeratorInbox } from "../../components/moderator/ModeratorInbox";


interface ModeratorDashboardProps {
    cloudinaryApi: ICloudinariImageAPIService;
    usersApi: IUsersAPIService;
}

const STORAGE_KEY = "moderator_notifications";

export default function ModeratorDashboard({
    cloudinaryApi,
    usersApi,
}: ModeratorDashboardProps) {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const [showProfile, setShowProfile] = useState(false);

    const [notifications, setNotifications] = useState<ModeratorNotification[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });

    const saveNotifications = (data: ModeratorNotification[]) => {
        setNotifications(data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    };

    const logoutHandler = () => {
        disconnectModeratorSocket();
        logout();
        navigate("/login");
    };

    const toggleProfile = () => {
        setShowProfile((prev) => !prev);
    };

    useEffect(() => {
        if (!user) return;

        const socket = connectModeratorSocket(user.id);

        const handleQuizRejected = (data: ModeratorNotification) => {
            console.log("Notification received:", data);

            const updated = [data, ...notifications];
            saveNotifications(updated);
        };

        
        socket.on("quiz_rejected", handleQuizRejected);

        return () => {
            socket.off("quiz_rejected", handleQuizRejected);
        };
    }, [user]);

    return (
        <div className="min-h-screen w-full bg-gray-900 backdrop-blur-sm text-gray-100 p-6 flex flex-col items-center justify-start space-y-6">
            <div className="w-full flex justify-between items-center">
                <h1 className="text-3xl font-bold">Welcome to moderator dashboard!</h1>

                <ModeratorInbox
                    notifications={notifications}
                    onOpenQuiz={(quizId) => navigate(`/quiz/edit/${quizId}`)}
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={toggleProfile}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                    {showProfile ? "Hide Profile" : "Show Profile"}
                </button>

                <button
                    onClick={logoutHandler}
                    className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                    Log out
                </button>

                <button
                    onClick={() => navigate("/quiz/create")}
                    className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                    Create Quiz
                </button>
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
        </div>
    );
}
