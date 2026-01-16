import type { UserDto } from "../../models/UserDto";
import type { AdminResponse } from "../../types/admin/AdminResponse";

export interface IAdminAPIService {
    listUsers(token: string): Promise<AdminResponse<UserDto[]>>;
    changeUserRole(token: string, userId: string, newRole: string): Promise<AdminResponse<UserDto>>;
    deleteUser(token: string, userId: string): Promise<AdminResponse<null>>;
}
