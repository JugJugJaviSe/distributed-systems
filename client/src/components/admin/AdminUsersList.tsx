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
        <div className="admin-users">
            {errorMessage && <p className="error">{errorMessage}</p>}

            <table className="users-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Actions</th>
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