import type { QuizQuestionDto } from "./QuizQuestionDto";

export interface CreateQuizDto {
    title: string;
    duration: number;
    author_id: number;
    questions: QuizQuestionDto[];
}
