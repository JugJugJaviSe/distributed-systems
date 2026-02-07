import { useParams, useNavigate } from "react-router-dom";
import EditQuizForm from "../../components/quiz/EditQuizForm";
import type { IQuizAPIService } from "../../api_services/quiz_api/IQuizAPIService";
import { Navbar } from "../../components/navbar/Navbar";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

interface Props {
    quizApi: IQuizAPIService;
}

export default function EditQuizPage({ quizApi }: Props) {
    const { quizId } = useParams();
    const navigate = useNavigate();

    if (!quizId) return <p>Invalid quiz id</p>;

    return (
        <DashboardLayout navbar={<Navbar />}>
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
        </DashboardLayout>
    );
}
