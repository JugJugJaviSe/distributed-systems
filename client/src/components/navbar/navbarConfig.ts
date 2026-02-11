export const NAVBAR_ITEMS: Record<string, { label: string; path: string }[]> = {
  Admin: [
    { label: "Quizzes", path: "/Admin-dashboard" },
    { label: "Pending Quizzes", path: "/Admin/pendingQuizzes" },
    { label: "Users", path: "/Admin/users" },
    { label: "Leaderboards", path: "/leaderboards" },
  ],
  Moderator: [
    { label: "Quizzes", path: "/Moderator-dashboard" },
    { label: "Create quiz", path: "/quiz/create" },
    { label: "Leaderboards", path: "/leaderboards" },
  ],
  Player: [
    { label: "Quizzes", path: "/Player-dashboard" },
    { label: "Leaderboards", path: "/leaderboards" },
  ],
};
