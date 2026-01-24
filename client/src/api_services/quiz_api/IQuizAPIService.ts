import type { CreateQuizDto } from "../../models/quiz/CreateQuizDto";
import type { GetAllQuizzesResponse } from "../../types/quiz/GetAllQuizzesResponse";
import type { GetQuizResponse } from "../../types/quiz/GetQuizResponses";

export interface IQuizAPIService {
    createQuiz(token: string, data: CreateQuizDto): Promise<any>;
    getQuiz(token: string, quizId: number): Promise<GetQuizResponse>;
    getAllQuizzes(token: string): Promise<GetAllQuizzesResponse>;
    getQuizForAdmin(token: string, quizId: number): Promise<GetQuizResponse>;

    approveQuiz(
        token: string,
        quizId: number,
        comment: string
    ): Promise<{ success: boolean; message: string }>;

    rejectQuiz(
        token: string,
        quizId: number,
        comment: string
    ): Promise<{ success: boolean; message: string }>;
}
