import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/UseAuthHook";
import { ProfileCard } from "../../components/profile_card/ProfileCard";
import type { ICloudinariImageAPIService } from "../../api_services/cloudinary_image_api/ICloudinaryImageAPIService";
import type { IUsersAPIService } from "../../api_services/users_api/IUsersAPIService";
import { useEffect, useState } from "react";
import ApprovedQuizzesTable from "../../components/quiz/ApprovedQuizzesTable";
import type { IQuizAPIService } from "../../api_services/quiz_api/IQuizAPIService";
import type { IAdminAPIService } from "../../api_services/admin_api/IAdminAPIService";
import type { AdminNotification } from "../../types/admin/AdminNotification";
import { AdminInbox } from "../../components/admin/AdminInbox";
import { useSocket } from "../../contextsts/SocketContext";
import { Navbar } from "../../components/navbar/Navbar";

const STORAGE_KEY = "admin_notifications";

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
    adminApi,
}: AdminDashboardProps) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const socket = useSocket();

    const [showProfile, setShowProfile] = useState(false);
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setNotifications(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (!socket) return;

        const handleQuizCreated = (data: AdminNotification) => {
            setNotifications((prev) => {
                const updated = [data, ...prev];
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                return updated;
            });
        };

        socket.on("quiz_created", handleQuizCreated);

        return () => {
            socket.off("quiz_created", handleQuizCreated);
        };
    }, [socket]);

    return (
        <div className="min-h-screen w-full bg-gray-900 text-gray-100 flex flex-col">
            <Navbar onProfileClick={() => setShowProfile(true)} />
            <div className="w-full flex justify-between items-center p-6">
                <h1 className="text-3xl font-bold">Quizzes</h1>

                <AdminInbox
                    notifications={notifications}
                    onOpenQuiz={(quizId) =>
                        navigate(`/admin/quizzes/${quizId}`)
                    }
                />
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
