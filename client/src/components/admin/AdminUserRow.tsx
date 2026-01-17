import type { UserDto } from "../../models/UserDto";

interface AdminUserRowProps {
    user: UserDto;
    onDelete: (userId: number) => void;
    onChangeRole: (userId: number, newRole: "Player" | "Moderator") => void;
}

export function AdminUserRow({ user, onDelete, onChangeRole }: AdminUserRowProps) {
    const isAdmin = user.role === "Admin";

    return (
        <tr className="user-row">
            <td className="user-id">{user.id}</td>
            <td className="user-email">{user.email}</td>
            <td className="user-name">{user.firstName} {user.lastName}</td>
            <td className="user-role">
                {isAdmin ? (
                    <span className="role-badge">{user.role}</span>
                ) : (
                    <select
                        value={user.role}
                        onChange={e =>
                            onChangeRole(
                                user.id,
                                e.target.value as "Player" | "Moderator"
                            )
                        }
                        className="role-select"
                    >
                        <option value="Player">Player</option>
                        <option value="Moderator">Moderator</option>
                    </select>
                )}
            </td>
            <td className="user-actions">
                {!isAdmin ? (
                    <button
                        onClick={() => onDelete(user.id)}
                        className="delete-btn"
                    >
                        Delete
                    </button>
                ) : (
                    <span>—</span>
                )}
            </td>
        </tr>
    );
}