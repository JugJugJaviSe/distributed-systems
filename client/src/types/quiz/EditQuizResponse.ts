export type EditQuizResponse = {
    success: boolean;
    message?: string;
    data?: any;
    errors?: Record<string, string>;
};
