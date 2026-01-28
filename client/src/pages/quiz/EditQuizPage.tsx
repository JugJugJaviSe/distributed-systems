import { useParams, useNavigate } from "react-router-dom";
import EditQuizForm from "../../components/quiz/EditQuizForm";
import type { IQuizAPIService } from "../../api_services/quiz_api/IQuizAPIService";

interface Props {
    quizApi: IQuizAPIService;
}

export default function EditQuizPage({ quizApi }: Props) {
    const { quizId } = useParams();
    const navigate = useNavigate();

    if (!quizId) return <p>Invalid quiz id</p>;

    return (
        <EditQuizForm
            quizId={Number(quizId)}
            quizApi={quizApi}
            onSaved={() => navigate("/Moderator-dashboard")}
        />
    );
}
