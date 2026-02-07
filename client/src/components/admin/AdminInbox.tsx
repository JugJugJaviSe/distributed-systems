import { useState } from "react";
import type { AdminNotification } from "../../types/admin/AdminNotification";
import { Bell } from "lucide-react";

interface AdminInboxProps {
    notifications: AdminNotification[];
    onOpenQuiz: (quizId: number) => void;
}

export function AdminInbox({ notifications, onOpenQuiz }: AdminInboxProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2 rounded-full bg-gray-900 hover:bg-gray-800 transition-colors ring-1 ring-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <Bell className="w-6 h-6 text-gray-100" />
                {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-xs font-semibold text-white rounded-full px-2 shadow-sm">
                        {notifications.length}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-900 ring-1 ring-gray-700 rounded-lg shadow-lg z-50 divide-y divide-gray-700 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
                    <div className="p-3 font-semibold text-gray-100">
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
                                className="p-3 hover:bg-gray-800 transition-colors flex justify-between items-center cursor-pointer"
                            >
                                <div>
                                    <div className="text-gray-100 font-medium">{n.title}</div>
                                    <div className="text-xs text-gray-300">
                                        Status: {n.status}
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        onOpenQuiz(n.quiz_id);
                                        setOpen(false);
                                    }}
                                    className="text-blue-400 text-sm font-semibold hover:text-blue-500 transition-colors"
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