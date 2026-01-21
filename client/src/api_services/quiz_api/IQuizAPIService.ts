import type { CreateQuizDto } from "../../models/quiz/CreateQuizDto";


export interface IQuizAPIService {
    createQuiz(token: string, data: CreateQuizDto): Promise<any>;
}
