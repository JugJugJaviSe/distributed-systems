import type { CreateQuizDto } from "../../types/quiz/CreateQuizDto";

export interface IQuizAPIService {
    createQuiz(data: CreateQuizDto): Promise<any>;
}
