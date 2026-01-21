import axios from "axios";
import type { QuizStartResponse, SubmitAnswerResponse, FinishQuizResponse } from "../../types/quiz_execution/QuizResponses";
import type { IQuizExecutionAPIService } from "./IQuizExecutionAPIService";

const API_URL: string = import.meta.env.VITE_API_URL + "/quiz-execution";

export const quizApi: IQuizExecutionAPIService = {
    async startQuiz(quizId: number): Promise<QuizStartResponse> {
        try {
            const payload = { quiz_id: quizId };
            const res = await axios.post<QuizStartResponse>(`${API_URL}/start`, payload, { withCredentials: true });
            return res.data;
        } catch (error) {
            let message = "Error starting quiz";
            if (axios.isAxiosError(error))
                message = error.response?.data?.message || message;

            return {
                success: false,
                message,
                data: undefined
            };
        }
    },

    async submitAnswer(attemptId: number, questionId: number, answerId: number): Promise<SubmitAnswerResponse> {
        try {
            const payload = { attempt_id: attemptId, question_id: questionId, answer_id: answerId };
            const res = await axios.post<SubmitAnswerResponse>(`${API_URL}/answer`, payload, { withCredentials: true });
            return res.data;
        } catch (error) {
            let message = "Error submitting answer";
            if (axios.isAxiosError(error))
                message = error.response?.data?.message || message;

            return {
                success: false,
                message,
                data: undefined
            };
        }
    },

    async finishQuiz(attemptId: number): Promise<FinishQuizResponse> {
        try {
            const payload = { attempt_id: attemptId };
            const res = await axios.post<FinishQuizResponse>(`${API_URL}/finish`, payload, { withCredentials: true });
            return res.data;
        } catch (error) {
            let message = "Error finishing quiz";
            if (axios.isAxiosError(error))
                message = error.response?.data?.message || message;

            return {
                success: false,
                message,
                data: undefined
            };
        }
    }
};