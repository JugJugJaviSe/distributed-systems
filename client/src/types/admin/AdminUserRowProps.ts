import type { UserDto } from "../../models/user/UserDto";

export interface AdminUserRowProps {
    user: UserDto;
    onDelete: (userId: number) => void;
    onChangeRole: (userId: number, newRole: "Player" | "Moderator") => void;
}