export interface EditQuizAnswerDto {
    answer_id: number | null;
    text: string;
    is_correct: boolean;
}

export interface EditQuizQuestionDto {
    question_id: number | null;
    text: string;
    points: number;
    answers: EditQuizAnswerDto[];
}

export interface EditQuizDto {
    title: string;
    duration: number;
    questions: EditQuizQuestionDto[];
}