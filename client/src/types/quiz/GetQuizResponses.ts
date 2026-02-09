export interface QuizAnswer {
    answer_id: number;
    text: string;
    is_correct?: boolean;   // Admin can see this field while user cannot
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
    status: "pending" | "approved" | "rejected";    // Admin can see this field while user cannot
}

export interface GetQuizResponse {
    success: boolean;
    message: string;
    data?: GetQuizResponseData;
}
