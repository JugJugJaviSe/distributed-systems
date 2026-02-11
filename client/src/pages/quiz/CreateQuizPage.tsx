import { useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { Navbar } from "../../components/navbar/Navbar";
import { ProfileCard } from "../../components/profile_card/ProfileCard";
import { CreateQuizForm } from "../../components/quiz/CreateQuizForm";
import type { CreateQuizPageProps } from "../../types/quiz/CreateQuizPageProps";

export default function CreateQuizPage({ cloudinaryApi, usersApi, quizApi }: CreateQuizPageProps) {
    const [showProfile, setShowProfile] = useState(false);

    return (
        <DashboardLayout navbar={<Navbar onProfileClick={() => setShowProfile(true)} />}>
            <div className="w-full max-w-5xl px-6 flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-100">Create Quiz</h1>
            </div>

            <div className="w-full max-w-5xl px-6">
                <CreateQuizForm quizApi={quizApi} cloudinaryApi={cloudinaryApi} usersApi={usersApi} />
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
