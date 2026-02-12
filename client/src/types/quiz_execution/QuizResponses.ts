export interface QuizStartResponseData {
    attempt_id: number;
    quiz_id: number;
    duration_seconds: number;
    started_at: string;
}

export interface QuizStartResponse {
    success: boolean;
    message: string;
    data?: QuizStartResponseData;
}

export interface SubmitAnswerResponseData {
    attempt_id: number;
    question_id: number;
    answer_ids: number[];
    answered_questions: number;
    total_questions: number;
}

export interface SubmitAnswerResponse {
    success: boolean;
    message: string;
    data?: SubmitAnswerResponseData;
}

export interface FinishQuizResponse {
    success: boolean;
    message: string;
}