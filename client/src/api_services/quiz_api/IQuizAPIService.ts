import type { CreateQuizDto } from "../../models/quiz/CreateQuizDto";
import type { GetQuizResponse } from "../../types/quiz/GetQuizResponses";

export interface IQuizAPIService {
    createQuiz(token: string, data: CreateQuizDto): Promise<any>;
    getQuiz(token: string, quizId: number): Promise<GetQuizResponse>;
}
