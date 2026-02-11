export type QuizListProps = {
  quizzes: Quiz[];
  onViewLeaderboard: (quizId: number) => void;
};

export type Quiz = {
  id: number;
  name: string;
};