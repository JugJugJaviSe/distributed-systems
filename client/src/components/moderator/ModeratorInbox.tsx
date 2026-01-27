import { Bell } from "lucide-react";
import type { ModeratorNotification } from "../../types/moderator/ModeratorNotification";


interface ModeratorInboxProps {
    notifications: ModeratorNotification[];
    onOpenQuiz: (quizId: number) => void;
}

export function ModeratorInbox({ notifications, onOpenQuiz }: ModeratorInboxProps) {
    return (
        <div className="relative">
            <button className="relative p-2 rounded-full bg-gray-800 hover:bg-gray-700">
                <Bell className="w-6 h-6" />
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-xs rounded-full px-2">
                        {notifications.length}
                    </span>
                )}
            </button>

            {notifications.length > 0 && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                    {notifications.map((n, index) => (
                        <div
                            key={index}
                            className="p-3 border-b border-gray-700 hover:bg-gray-700 cursor-pointer"
                            onClick={() => onOpenQuiz(n.quiz_id)}
                        >
                            <p className="text-sm font-semibold">Quiz rejected</p>
                            <p className="text-xs text-gray-400">{n.comment}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
