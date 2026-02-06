import type { QuizCatalogItem } from "../../models/quizCatalog/QuizCatalog";
export interface QuizCatalogGridProps {
  items: QuizCatalogItem[];
  formatDuration: (seconds: number) => string;
  onPlay: (quizId: number) => void;
}

