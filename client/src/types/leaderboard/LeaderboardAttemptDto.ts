export type LeaderboardAttemptDto = {
  quiz_id: number;
  player_email: string;
  started_at: string;          // "YYYY-MM-DD HH:mm:ss"
  finished_at: string;         // "YYYY-MM-DD HH:mm:ss"
  score: number;
  time_taken_seconds: number;
};