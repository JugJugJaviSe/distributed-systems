export type LeaderboardAttemptDto = {
  quiz_id: number;
  player_id: number;
  started_at: string;          // "YYYY-MM-DD HH:mm:ss"
  finished_at: string;         // "YYYY-MM-DD HH:mm:ss"
  score: number;
  time_taken_seconds: number;
};