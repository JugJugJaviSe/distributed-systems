import type { IQuizAPIService } from "../../api_services/quiz_api/IQuizAPIService";
export interface EditQuizFormProps {
    quizId: number;
    quizApi: IQuizAPIService;
    onSaved: () => void;
}