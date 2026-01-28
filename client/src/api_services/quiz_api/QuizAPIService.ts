import axios from "axios";
import type { IQuizAPIService } from "./IQuizAPIService";
import type { CreateQuizDto } from "../../models/quiz/CreateQuizDto";
import type { GetQuizResponse } from "../../types/quiz/GetQuizResponses";
import type { GetAllQuizzesResponse } from "../../types/quiz/GetAllQuizzesResponse";

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
    },

    async getAllQuizzes(token: string): Promise<GetAllQuizzesResponse> {
        try {
            const res = await axios.get<GetAllQuizzesResponse>(
                `${API_URL}/allQuizzes`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return res.data;
        } catch (error) {
            let message = "Get all quizzes error";
            if (axios.isAxiosError(error))
                message = error.response?.data?.message || message;

            return { success: false, message, data: undefined };
        }
    },

    async getQuizForAdmin(token: string, quizId: number) {
        try {
            const res = await axios.get(
                `${API_URL}/admin/${quizId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return res.data;
        } catch (error) {
            let message = "Get quiz for admin error";
            if (axios.isAxiosError(error))
                message = error.response?.data?.message || message;

            return { success: false, message, data: undefined };
        }
    },

    async approveQuiz(
        token: string,
        quizId: number,
        comment: string
    ): Promise<{ success: boolean; message: string }> {
        try {
            const res = await axios.put(
                `${API_URL}/admin/${quizId}/approve`,
                { comment },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            return res.data;
        } catch (error) {
            let message = "Approve quiz error";

            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }

            return { success: false, message };
        }
    },

    async rejectQuiz(
        token: string,
        quizId: number,
        comment: string
    ): Promise<{ success: boolean; message: string }> {
        try {
            const res = await axios.put(
                `${API_URL}/admin/${quizId}/reject`,
                { comment },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            return res.data;
        } catch (error) {
            let message = "Reject quiz error";

            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }

            return { success: false, message };
        }
    },

    async deleteQuiz(quizId: number, token: string): Promise<{ success: boolean; message: string }> {
        try {
            const res = await axios.delete(
                `${API_URL}/delete/${quizId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            return res.data;
        } catch (error) {
            let message = "Delete quiz error";

            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }

            return { success: false, message };
        }
    },

    async getMyQuizzes(token: string): Promise<GetAllQuizzesResponse> {
        try {
            const res = await axios.get<GetAllQuizzesResponse>(
                `${API_URL}/my`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return res.data;
        } catch (error) {
            let message = "Get my quizzes error";
            if (axios.isAxiosError(error))
                message = error.response?.data?.message || message;

            return { success: false, message, data: undefined };
        }
    }


};
