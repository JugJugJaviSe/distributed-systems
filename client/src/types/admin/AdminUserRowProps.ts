import type { UserDto } from "../../models/UserDto";

export interface AdminUserRowProps {
    user: UserDto;
    onDelete: (userId: number) => void;
    onChangeRole: (userId: number, newRole: "Player" | "Moderator") => void;
}