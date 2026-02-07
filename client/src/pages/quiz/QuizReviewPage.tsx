import { useNavigate, useParams } from "react-router-dom";
import { QuizReviewModal } from "../../components/admin/QuizReviewModal";
import { quizApi } from "../../api_services/quiz_api/QuizAPIService";
import { useAuth } from "../../hooks/UseAuthHook";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { Navbar } from "../../components/navbar/Navbar";

export default function QuizReviewPage() {
    const { quizId } = useParams<{ quizId: string }>();
    const navigate = useNavigate();
    const { token } = useAuth();

    const approve = async (comment: string) => {
        await quizApi.approveQuiz(token!, Number(quizId), comment);
        navigate("/Admin-dashboard");
    };

    const reject = async (comment: string) => {
        await quizApi.rejectQuiz(token!, Number(quizId), comment);
        navigate("/Admin-dashboard");
    };

    return (
        <DashboardLayout navbar={<Navbar />}>
            <div className="w-full max-w-5xl px-6 flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-100">Review Quiz</h1>
            </div>

            <div className="w-full max-w-5xl px-6">
                <QuizReviewModal
                    quizId={Number(quizId)}
                    onClose={() => navigate("/Admin-dashboard")}
                    onApprove={approve}
                    onReject={reject}
                />
            </div>
        </DashboardLayout>
    );
}