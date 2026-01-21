import axios from "axios";
import type { IQuizAPIService } from "./IQuizAPIService";
import type { CreateQuizDto } from "../../models/quiz/CreateQuizDto";

const API_URL: string = import.meta.env.VITE_API_URL + "/quizzes";

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
    }
};
