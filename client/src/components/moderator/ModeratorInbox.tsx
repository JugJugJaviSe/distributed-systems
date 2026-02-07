import { Bell } from "lucide-react";
import { useState } from "react";
import type { ModeratorNotification } from "../../types/moderator/ModeratorNotification";

interface ModeratorInboxProps {
    notifications: ModeratorNotification[];
    onOpenQuiz: (quizId: number) => void;
}

export function ModeratorInbox({ notifications, onOpenQuiz }: ModeratorInboxProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                className="relative p-2 rounded-full bg-gray-900 hover:bg-gray-800 transition-colors ring-1 ring-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => setOpen(o => !o)}
            >
                <Bell className="w-6 h-6 text-gray-100" />
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-xs font-semibold text-white rounded-full px-2 shadow-sm">
                        {notifications.length}
                    </span>
                )}
            </button>

            {open && notifications.length > 0 && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-900 ring-1 ring-gray-700 rounded-lg shadow-lg z-50 divide-y divide-gray-700 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                    {notifications.map((n) => (
                        <div
                            key={n.quiz_id}
                            className="p-3 hover:bg-gray-800 transition-colors cursor-pointer"
                            onClick={() => {
                                setOpen(false);
                                onOpenQuiz(n.quiz_id);
                            }}
                        >
                            <p className="text-sm font-semibold text-gray-100">Quiz rejected</p>
                            <p className="text-xs text-gray-300">{n.comment}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}