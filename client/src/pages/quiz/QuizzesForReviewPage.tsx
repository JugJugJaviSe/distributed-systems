import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/UseAuthHook";
import { Navbar } from "../../components/navbar/Navbar";
import { DashboardLayout } from "../../components/dashboard/DashboardLayout";
import PendingQuizzesTable from "../../components/quiz/PendingQuizzesTable";
import type { IQuizAPIService } from "../../api_services/quiz_api/IQuizAPIService";

export interface QuizzesForReviewProps {
    quizApi: IQuizAPIService;
}

export default function QuizzesForReviewPage({ quizApi }: QuizzesForReviewProps) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated || !user) {
            navigate("/login");
            return;
        }

        if (user.role !== "Admin") {
            navigate(`/${user.role}-dashboard`);
        }
    }, [isAuthenticated, isLoading, user, navigate]);

    if (isLoading || !user || user.role !== "Admin") return null;

    return (
        <DashboardLayout navbar={<Navbar />}>
            <div className="w-full max-w-5xl px-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-100">
                    Pending Quizzes
                </h1>
            </div>

            <div className="w-full max-w-5xl px-6">
                <PendingQuizzesTable quizApi={quizApi} />
            </div>
        </DashboardLayout>
    );
}
