import { useCallback, useEffect, useState } from "react";
import type { UserDto } from "../../models/UserDto";
import type { AdminUsersProps } from "../../types/admin/AdminUsersPageProps";
import { useAuth } from "../../hooks/UseAuthHook";

export function AdminUsersList({ adminApi }: AdminUsersProps) {
  const { token } = useAuth();

  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const res = await adminApi.listUsers(token);
      if (res.success && res.data) setUsers(res.data);
      else setError(res.message || "Failed to load users.");
    } catch (e: any) {
      setError(e?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  }, [adminApi, token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDeleteUser = async (userId: number) => {
    if (!token) return;

    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      const res = await adminApi.deleteUser(token, userId.toString());
      if (res.success) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
      } else {
        alert(res.message || "Delete failed.");
      }
    } catch (e: any) {
      alert(e?.message || "Delete failed.");
    }
  };

  const handleChangeRole = async (userId: number, newRole: "Player" | "Moderator") => {
    if (!token) return;

    const confirmed = window.confirm(`Change role to '${newRole}'?`);
    if (!confirmed) return;

    try {
      const res = await adminApi.changeUserRole(token, userId.toString(), newRole);
      if (res.success && res.data) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? res.data! : u)));
      } else {
        alert(res.message || "Role change failed.");
      }
    } catch (e: any) {
      alert(e?.message || "Role change failed.");
    }
  };

  if (!token) return null;
  if (loading) return <p className="text-gray-500">Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-6 py-3 text-left uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left uppercase tracking-wider">Actions</th>
          </tr>
        </thead>

        <tbody className="bg-white">
          {users.map((user, idx) => {
            const isAdmin = user.role === "Admin";

            return (
              <tr
                key={user.id}
                className={`
                  ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  hover:bg-gray-100 transition-colors duration-200
                `}
              >
                <td className="px-6 py-4 text-gray-500">{user.id}</td>

                <td className="px-6 py-4 text-gray-600">{user.email}</td>

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
                      onChange={(e) =>
                        handleChangeRole(user.id, e.target.value as "Player" | "Moderator")
                      }
                      className="px-3 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="Player">Player</option>
                      <option value="Moderator">Moderator</option>
                    </select>
                  )}
                </td>

                <td className="px-6 py-4 text-center">
                  {isAdmin ? (
                    <span className="text-gray-400">—</span>
                  ) : (
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            );
          })}

          {users.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-6 text-gray-500">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
