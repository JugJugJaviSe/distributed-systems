import type { QuizFromList } from "./QuizFromList"

export type GetAllQuizzesResponse = {
    success: boolean,
    message: string,
    data?: QuizFromList[]
}