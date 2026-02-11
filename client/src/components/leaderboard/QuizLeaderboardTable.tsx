// src/components/quiz/QuizLeaderboardTable.tsx
import type { LeaderboardAttemptDto } from "../../types/leaderboard/LeaderboardAttemptDto";

interface QuizLeaderboardTableProps {
    items: LeaderboardAttemptDto[];
    page: number;
    pageSize: number;
    formatSeconds: (seconds: number) => string;
}

export function QuizLeaderboardTable({
    items,
    page,
    pageSize,
    formatSeconds,
}: QuizLeaderboardTableProps) {
    const start = (page - 1) * pageSize;
    const pageItems = items.slice(start, start + pageSize);

    if (items.length === 0) {
        return <p className="text-gray-400 px-6 py-4">No attempts yet.</p>;
    }

    return (
        <div className="w-full max-w-5xl px-6">
            <div className="overflow-x-auto rounded-xl ring-1 ring-gray-700 bg-gray-900 shadow-lg">
                <table className="min-w-full border-separate border-spacing-0 table-fixed">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="w-1/4 px-6 py-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                                Rank
                            </th>
                            <th className="w-1/4 px-6 py-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
                                Player
                            </th>
                            <th className="w-1/4 px-6 py-5 text-right text-xs font-semibold uppercase tracking-wider text-gray-300">
                                Score
                            </th>
                            <th className="w-1/4 px-6 py-5 text-right text-xs font-semibold uppercase tracking-wider text-gray-300">
                                Time
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {pageItems.map((a, idx) => {
                            const rank = (page - 1) * pageSize + idx + 1;

                            return (
                                <tr
                                    key={`${a.player_email}-${idx}`}
                                    className={`${idx % 2 === 0 ? "bg-gray-900" : "bg-gray-800/60"
                                        } hover:bg-gray-800 transition-colors`}
                                >
                                    <td className="w-1/4 px-6 py-6 text-base font-semibold text-gray-200">
                                        #{rank}
                                    </td>

                                    <td className="w-1/4 px-6 py-6 text-base font-medium text-gray-100">
                                        {a.player_email}
                                    </td>

                                    <td className="w-1/4 px-6 py-6 text-base text-right font-semibold text-gray-100">
                                        {a.score}
                                    </td>

                                    <td className="w-1/4 px-6 py-6 text-base text-right text-gray-400">
                                        {formatSeconds(a.time_taken_seconds)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}