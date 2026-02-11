export type QuizListItemProps = {
  quizId: number;
  quizName: string;
  onViewLeaderboard: (quizId: number) => void;
};