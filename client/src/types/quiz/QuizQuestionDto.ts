import type { QuizAnswerDto } from './QuizAnswerDto';
export interface QuizQuestionDto {
    text: string;
    points: number;
    answers: QuizAnswerDto[];
}