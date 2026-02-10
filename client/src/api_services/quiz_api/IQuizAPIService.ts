import type { CreateQuizDto } from "../../models/quiz/CreateQuizDto";
import type { CreateQuizResponse } from "../../types/quiz/CreateQuizResponse";
import type { EditQuizResponse } from "../../types/quiz/EditQuizResponse";
import type { GetAllQuizzesResponse } from "../../types/quiz/GetAllQuizzesResponse";
import type { GetQuizCatalogResponse } from "../../types/quiz/GetQuizCatalogResponse";
import type { GetQuizResponse } from "../../types/quiz/GetQuizResponses";
import type { QuizResponse } from "../../types/quiz/QuizResponse"; 

export interface IQuizAPIService {
    createQuiz(token: string, data: CreateQuizDto): Promise<CreateQuizResponse>;
    getQuiz(token: string, quizId: number): Promise<GetQuizResponse>;
    getRejectedQuiz(token: string, quizId: number): Promise<GetQuizResponse>;
    editQuiz(token: string, quizId: number, data: any): Promise<EditQuizResponse>;
    getApprovedQuizzes(token: string): Promise<GetAllQuizzesResponse>;
    getPendingQuizzes(token: string): Promise<GetAllQuizzesResponse>;
    getMyQuizzes(token: string): Promise<GetAllQuizzesResponse>;
    getQuizForAdmin(token: string, quizId: number): Promise<GetQuizResponse>;
    approveQuiz(token: string, quizId: number, comment: string): Promise<QuizResponse>;
    rejectQuiz(token: string, quizId: number, comment: string): Promise<QuizResponse>;
    deleteQuiz(quizId: number, token: string): Promise<QuizResponse>;
    getCatalog(token: string, page: number, pageSize: number): Promise<GetQuizCatalogResponse>
}
