export type CreateQuizResponse = {
    success: boolean;
    message?: string;
    data?: any;
    errors?: Record<string, string>;
};
