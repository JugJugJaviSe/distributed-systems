import type { AdminUserRowProps } from "../../types/admin/AdminUserRowProps";

export function AdminUserRow({ user, onDelete, onChangeRole }: AdminUserRowProps) {
  const isAdmin = user.role === "Admin";

  return (
    <tr className="hover:bg-gray-100 transition-colors duration-200">
      <td className="px-6 py-4 text-gray-500">{user.id}</td>

      <td className="px-6 py-4 text-gray-700">{user.email}</td>

      <td className="px-6 py-4 font-medium text-gray-700">
        {user.firstName} {user.lastName}
      </td>

      <td className="px-6 py-4 text-gray-600">
        {isAdmin ? (
          <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-xs font-medium">
            {user.role}
          </span>
        ) : (
          <select
            value={user.role}
            onChange={(e) => onChangeRole(user.id, e.target.value as "Player" | "Moderator")}
            className="px-2 py-1 bg-white text-gray-700 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
          >
            <option value="Player">Player</option>
            <option value="Moderator">Moderator</option>
          </select>
        )}
      </td>

      <td className="px-6 py-4 text-center">
        {!isAdmin ? (
          <button
            onClick={() => onDelete(user.id)}
            className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow"
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
