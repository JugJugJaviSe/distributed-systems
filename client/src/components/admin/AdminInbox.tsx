import { useState } from "react";
import type { AdminNotification } from "../../types/admin/AdminNotification";
import { Bell } from "lucide-react";

export function AdminInbox({
    notifications,
    onOpenQuiz,
}: {
    notifications: AdminNotification[];
    onOpenQuiz: (quizId: number) => void;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2 rounded-full hover:bg-gray-700"
            >
                <Bell className="w-6 h-6" />
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-xs rounded-full px-1.5">
                        {notifications.length}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl z-50">
                    <div className="p-3 font-semibold border-b border-gray-700">
                        New quizzes
                    </div>

                    {notifications.length === 0 ? (
                        <div className="p-3 text-gray-400 text-center">
                            No notifications
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.quiz_id}
                                className="p-3 hover:bg-gray-700 flex justify-between items-center"
                            >
                                <div>
                                    <div className="text-white">{n.title}</div>
                                    <div className="text-xs text-gray-400">
                                        Status: {n.status}
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        onOpenQuiz(n.quiz_id);
                                        setOpen(false);
                                    }}
                                    className="text-blue-400 text-sm"
                                >
                                    Review
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
