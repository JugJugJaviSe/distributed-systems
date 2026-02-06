import type { QuizStartResponse, SubmitAnswerResponse, FinishQuizResponse } from "../../types/quiz_execution/QuizResponses";

export interface IQuizExecutionAPIService {
    startQuiz(token: string, quizId: number): Promise<QuizStartResponse>;
    submitAnswer(token: string, attemptId: number, questionId: number, answerIds: number[]): Promise<SubmitAnswerResponse>;
    finishQuiz(token: string, attemptId: number): Promise<FinishQuizResponse>;
}
