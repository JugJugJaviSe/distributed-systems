import axios from "axios";
import type { IQuizAPIService } from "./IQuizAPIService";
import type { CreateQuizDto } from "../../models/quiz/CreateQuizDto";
import type { GetQuizResponse } from "../../types/quiz/GetQuizResponses";

const API_URL: string = import.meta.env.VITE_API_URL + "/quiz";

export const quizApi: IQuizAPIService = {
    async createQuiz(token: string, data: CreateQuizDto): Promise<any> {
        try {
            const res = await axios.post(
                `${API_URL}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            return res.data;
        } catch (error) {
            let message: string = "Create quiz error";

            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }

            return {
                success: false,
                message: message,
                data: undefined
            };
        }
    },

    async getQuiz(token: string, quizId: number): Promise<GetQuizResponse> {
        try {
            const res = await axios.get<GetQuizResponse>(
                `${API_URL}/${quizId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            return res.data;
        } catch (error) {
            let message = "Get quiz error";
            if (axios.isAxiosError(error))
                message = error.response?.data?.message || message;

            return { success: false, message, data: undefined };
        }
    }
};
