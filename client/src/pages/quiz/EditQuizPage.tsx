import { useParams, useNavigate } from "react-router-dom";
import EditQuizForm from "../../components/quiz/EditQuizForm";
import type { IQuizAPIService } from "../../api_services/quiz_api/IQuizAPIService";
import { Navbar } from "../../components/navbar/Navbar";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useState } from "react";
import type { ICloudinariImageAPIService } from "../../api_services/cloudinary_image_api/ICloudinaryImageAPIService";
import type { IUsersAPIService } from "../../api_services/users_api/IUsersAPIService";
import { ProfileCard } from "../../components/profile_card/ProfileCard";

interface EditQuizPageProps {
    cloudinaryApi: ICloudinariImageAPIService;
    usersApi: IUsersAPIService;
    quizApi: IQuizAPIService;
}

export default function EditQuizPage({ cloudinaryApi, usersApi, quizApi }: EditQuizPageProps) {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [showProfile, setShowProfile] = useState(false);

    if (!quizId) return <p>Invalid quiz id</p>;

    return (
        <DashboardLayout navbar={<Navbar onProfileClick={() => setShowProfile(true)} />}>
            {/* Header */}
            <div className="w-full max-w-5xl px-6 flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-100">Edit Quiz</h1>
            </div>

            {/* Edit Form */}
            <div className="w-full max-w-5xl px-6">
                <div className="bg-gray-900 rounded-xl shadow-lg p-6">
                    <EditQuizForm
                        quizId={Number(quizId)}
                        quizApi={quizApi}
                        onSaved={() => navigate("/Moderator-dashboard")}
                    />
                </div>
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
