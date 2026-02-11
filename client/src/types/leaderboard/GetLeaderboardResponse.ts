import type{ LeaderboardAttemptDto } from "./LeaderboardAttemptDto";
export type GetLeaderboardResponse = {
  success: boolean;
  message?: string;
  data?: LeaderboardAttemptDto[];
};