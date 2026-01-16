import { useEffect, useState } from "react";
import type { UserDto } from "../../models/UserDto";

interface AdminUserRowProps {
    user: UserDto;
    onDelete: (userId: number) => void;
    onChangeRole: (userId: number, newRole: "Player" | "Moderator") => void;
}

export function AdminUserRow({ user, onDelete, onChangeRole }: AdminUserRowProps) {
    const isAdmin = user.role === "Admin";

    const [selectedRole, setSelectedRole] = useState<"Player" | "Moderator">(
        user.role === "Moderator" ? "Moderator" : "Player"
    );

    useEffect(() => {
        if (user.role === "Player" || user.role === "Moderator") {
            setSelectedRole(user.role);
        }
    }, [user.role]);

    const applyRoleChange = () => {
        if (selectedRole !== user.role) {
            onChangeRole(user.id, selectedRole);
        }
    };

    return (
        <tr>
            <td>{user.id}</td>
            <td>{user.email}</td>
            <td>{user.firstName} {user.lastName}</td>
            <td>
                {isAdmin ? (
                    user.role
                ) : (
                    <select
                        value={user.role}
                        onChange={e =>
                            onChangeRole(
                                user.id,
                                e.target.value as "Player" | "Moderator"
                            )
                        }
                    >
                        <option value="Player">Player</option>
                        <option value="Moderator">Moderator</option>
                    </select>
                )}
            </td>
            <td>
                {!isAdmin && (
                    <>
                        <button
                            onClick={applyRoleChange}
                            disabled={selectedRole === user.role}
                        >
                            Apply
                        </button>
                        {" "}
                        <button onClick={() => onDelete(user.id)}>
                            Delete
                        </button>
                    </>
                )}

                {isAdmin && <span>—</span>}
            </td>
        </tr>
    );
}