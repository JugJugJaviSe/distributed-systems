import type { AdminUserRowProps } from "../../types/admin/AdminUserRowProps";

export function AdminUserRow({ user, onDelete, onChangeRole }: AdminUserRowProps) {
    const isAdmin = user.role === "Admin";

    return (
        <tr className="hover:bg-gray-700 transition-colors">
            <td className="px-4 py-2 text-gray-100 text-sm">{user.id}</td>
            <td className="px-4 py-2 text-gray-100 text-sm">{user.email}</td>
            <td className="px-4 py-2 text-gray-100 text-sm">{user.firstName} {user.lastName}</td>
            <td className="px-4 py-2 text-gray-100 text-sm">
                {isAdmin ? (
                    <span className="px-2 py-1 bg-gray-600 text-gray-100 rounded-md text-xs font-medium">
                        {user.role}
                    </span>
                ) : (
                    <select
                        value={user.role}
                        onChange={e =>
                            onChangeRole(
                                user.id,
                                e.target.value as "Player" | "Moderator"
                            )
                        }
                        className="px-2 py-1 bg-gray-700 text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                    >
                        <option value="Player">Player</option>
                        <option value="Moderator">Moderator</option>
                    </select>
                )}
            </td>
            <td className="px-4 py-2 text-gray-100 text-sm">
                {!isAdmin ? (
                    <button
                        onClick={() => onDelete(user.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-md text-sm transition-all duration-150"
                    >
                        Delete
                    </button>
                ) : (
                    <span className="text-gray-400">—</span>
                )}
            </td>
        </tr>
    );
}