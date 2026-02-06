export interface QuizCatalogItem {
  id: number;
  title: string;
  duration_seconds: number;
  created_at: string | null;
  author_email: string;
}

export interface QuizCatalogResponse {
  items: QuizCatalogItem[];
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}