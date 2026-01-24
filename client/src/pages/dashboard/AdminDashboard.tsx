import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuthHook";
import { ProfileCard } from "../../components/profile_card/ProfileCard";
import type { ICloudinariImageAPIService } from "../../api_services/cloudinary_image_api/ICloudinaryImageAPIService";
import type { IUsersAPIService } from "../../api_services/users_api/IUsersAPIService";
import { useEffect, useState } from "react";
import { connectAdminSocket, disconnectAdminSocket } from "../../sockets/adminSocket";
import ApprovedQuizzesTable from "../../components/quiz/ApprovedQuizzesTable";
import type { IQuizAPIService } from "../../api_services/quiz_api/IQuizAPIService";
import type { IAdminAPIService } from "../../api_services/admin_api/IAdminAPIService";
import type { AdminNotification } from "../../types/admin/AdminNotification";
import { AdminInbox } from "../../components/admin/AdminInbox";

interface AdminDashboardProps {
    cloudinaryApi: ICloudinariImageAPIService;
    usersApi: IUsersAPIService;
    quizApi: IQuizAPIService;
    adminApi: IAdminAPIService;
}

export default function AdminDashboard({
    cloudinaryApi,
    usersApi,
    quizApi,
    adminApi
}: AdminDashboardProps) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [showProfile, setShowProfile] = useState(false);
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);

    const goToAdminUsersPage = () => {
        navigate("/Admin/users");
    };

    const logoutHandler = () => {
        logout();
        navigate("/login");
    };

    const toggleProfile = () => {
        setShowProfile((prev) => !prev);
    };

    useEffect(() => {
        const socket = connectAdminSocket();

        socket.emit("join", "admins");

        const handleQuizCreated = (data: any) => {
            console.log("New quiz created:", data);
            setNotifications((prev) => [data, ...prev]);
        };

        socket.on("quiz_created", handleQuizCreated);

        return () => {
            socket.off("quiz_created", handleQuizCreated);
            disconnectAdminSocket();
        };
    }, []);

    return (
        <div className="min-h-screen w-full bg-gray-900 backdrop-blur-sm text-gray-100 p-6 flex flex-col items-center justify-start space-y-6">
            <div className="w-full flex justify-between items-center">
                <h1 className="text-3xl font-bold">Welcome to admin dashboard!</h1>
                <AdminInbox
                    notifications={notifications}
                    onOpenQuiz={(quizId) => navigate(`/admin/quizzes/${quizId}`)}
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={goToAdminUsersPage}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                    Users page
                </button>
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
            </div>

            <ApprovedQuizzesTable quizApi={quizApi} adminApi={adminApi} />

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