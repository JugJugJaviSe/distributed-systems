import type { CreateQuizDto } from "../../models/quiz/CreateQuizDto";
import type { CreateQuizResponse } from "../../types/quiz/CreateQuizResponse";
import type { EditQuizResponse } from "../../types/quiz/EditQuizResponse";
import type { GetAllQuizzesResponse } from "../../types/quiz/GetAllQuizzesResponse";
import type { GetQuizCatalogResponse } from "../../types/quiz/GetQuizCatalogResponse";
import type { GetQuizResponse } from "../../types/quiz/GetQuizResponses";

export interface IQuizAPIService {
    createQuiz(token: string, data: CreateQuizDto): Promise<CreateQuizResponse>;
    getQuiz(token: string, quizId: number): Promise<GetQuizResponse>;
    getRejectedQuiz(token: string, quizId: number): Promise<GetQuizResponse>; 
    editQuiz(token: string, quizId: number, data: any): Promise<EditQuizResponse>; 
    getAllQuizzes(token: string): Promise<GetAllQuizzesResponse>;
    getMyQuizzes(token: string): Promise<GetAllQuizzesResponse>;
    getQuizForAdmin(token: string, quizId: number): Promise<GetQuizResponse>;
    approveQuiz(token: string, quizId: number, comment: string): Promise<{ success: boolean; message: string }>;
    rejectQuiz(token: string, quizId: number, comment: string): Promise<{ success: boolean; message: string }>;
    deleteQuiz(quizId: number, token: string): Promise<{ success: boolean; message: string }>;
    getCatalog(token: string, page: number, pageSize: number): Promise<GetQuizCatalogResponse>
}
