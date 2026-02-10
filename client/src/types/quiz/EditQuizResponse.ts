export interface EditQuizData {
    quiz_id: number;
    status: string;
}
export type EditQuizResponse = {
    success: boolean;
    message?: string;
    data?: EditQuizData;
    errors?: Record<string, string>;
};
