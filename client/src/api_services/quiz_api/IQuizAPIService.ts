import type { CreateQuizDto } from "../../models/quiz/CreateQuizDto";
import type { GetAllQuizzesResponse } from "../../types/quiz/GetAllQuizzesResponse";
import type { GetQuizResponse } from "../../types/quiz/GetQuizResponses";

export interface IQuizAPIService {
    createQuiz(token: string, data: CreateQuizDto): Promise<any>;
    getQuiz(token: string, quizId: number): Promise<GetQuizResponse>;
    getRejectedQuiz(token: string, quizId: number): Promise<GetQuizResponse>; 
    editQuiz(token: string, quizId: number, data: any): Promise<{ success: boolean; message: string }>; 
    getAllQuizzes(token: string): Promise<GetAllQuizzesResponse>;
    getMyQuizzes(token: string): Promise<GetAllQuizzesResponse>;
    getQuizForAdmin(token: string, quizId: number): Promise<GetQuizResponse>;
    approveQuiz(token: string, quizId: number, comment: string): Promise<{ success: boolean; message: string }>;
    rejectQuiz(token: string, quizId: number, comment: string): Promise<{ success: boolean; message: string }>;
    deleteQuiz(quizId: number, token: string): Promise<{ success: boolean; message: string }>;
}
