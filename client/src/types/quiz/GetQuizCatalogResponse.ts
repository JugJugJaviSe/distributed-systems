import type { QuizCatalogResponse } from "../../models/quizCatalog/QuizCatalog";
export type GetQuizCatalogResponse = {
  success: boolean;
  message: string;
  data?: QuizCatalogResponse;
};