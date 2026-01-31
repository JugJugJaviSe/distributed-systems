import { useParams, useNavigate } from "react-router-dom";
import EditQuizForm from "../../components/quiz/EditQuizForm";
import type { IQuizAPIService } from "../../api_services/quiz_api/IQuizAPIService";
import { Navbar } from "../../components/navbar/Navbar";

interface Props {
    quizApi: IQuizAPIService;
}

export default function EditQuizPage({ quizApi }: Props) {
    const { quizId } = useParams();
    const navigate = useNavigate();

    if (!quizId) return <p>Invalid quiz id</p>;

    return (
        <div>
            <Navbar />
            <EditQuizForm
                quizId={Number(quizId)}
                quizApi={quizApi}
                onSaved={() => navigate("/Moderator-dashboard")}
            />
        </div>
    );
}
