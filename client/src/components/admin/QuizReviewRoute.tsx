import { useNavigate, useParams } from "react-router-dom";
import { QuizReviewModal } from "../../components/admin/QuizReviewModal";
import { quizApi } from "../../api_services/quiz_api/QuizAPIService";
import { useAuth } from "../../hooks/UseAuthHook";

export default function QuizReviewRoute() {
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
        <QuizReviewModal
            quizId={Number(quizId)}
            onClose={() => navigate("/Admin-dashboard")}
            onApprove={approve}
            onReject={reject}
        />
    );
}
