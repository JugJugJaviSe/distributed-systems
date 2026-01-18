import { useEffect, useState } from "react";
import type { UserDto } from "../../models/UserDto";
import type { AdminUsersProps } from "../../types/admin/AdminUsersPageProps";
import { AdminUserRow } from "./AdminUserRow";
import { useAuth } from "../../hooks/UseAuthHook";

export function AdminUsersList({ adminApi }: AdminUsersProps) {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const { token } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const result = await adminApi.listUsers(token!);

        if (result.success && result.data) {
            setUsers(result.data);
        } else {
            setErrorMessage(result.message);
        }
    };

    const handleDeleteUser = async (userId: number) => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (!confirmed) return;

        const result = await adminApi.deleteUser(token!, userId.toString());

        if (result.success) {
            setUsers(prev => prev.filter(u => u.id !== userId));    // Delete user from view
        } else {
            alert(result.message);
        }
    };

    const handleChangeRole = async (userId: number, newRole: "Player" | "Moderator") => {
        const confirmed = window.confirm(`Are you sure you want to change role to \'${newRole}\' for this user?`);
        if (!confirmed) return;

        const result = await adminApi.changeUserRole(token!, userId.toString(), newRole);

        if (result.success && result.data) {
            setUsers(prev =>
                prev.map(u => (u.id === userId ? result.data! : u))     // Update user in view
            );
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="p-6 min-h-screen bg-gray-900 flex flex-col items-center">
            {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

            <table className="min-w-full divide-y divide-gray-700 bg-gray-800 rounded-lg shadow-lg">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-left text-gray-200 font-semibold text-sm">ID</th>
                        <th className="px-4 py-2 text-left text-gray-200 font-semibold text-sm">Email</th>
                        <th className="px-4 py-2 text-left text-gray-200 font-semibold text-sm">Name</th>
                        <th className="px-4 py-2 text-left text-gray-200 font-semibold text-sm">Role</th>
                        <th className="px-4 py-2 text-left text-gray-200 font-semibold text-sm">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <AdminUserRow
                            key={user.id}
                            user={user}
                            onDelete={handleDeleteUser}
                            onChangeRole={handleChangeRole}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}