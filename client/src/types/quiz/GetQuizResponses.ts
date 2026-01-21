export interface QuizAnswer {
    answer_id: number;
    text: string;
}

export interface QuizQuestion {
    question_id: number;
    text: string;
    points: number;
    answers: QuizAnswer[];
}

export interface GetQuizResponseData {
    quiz_id: number;
    title: string;
    description: string;
    duration_seconds: number;
    questions: QuizQuestion[];
}

export interface GetQuizResponse {
    success: boolean;
    message: string;
    data?: GetQuizResponseData;
}
