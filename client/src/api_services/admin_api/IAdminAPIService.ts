import type { UserDto } from "../../models/user/UserDto";
import type { AdminReportResponse } from "../../types/admin/AdminReportResponse";
import type { AdminResponse } from "../../types/admin/AdminResponse";

export interface IAdminAPIService {
    listUsers(token: string): Promise<AdminResponse<UserDto[]>>;
    changeUserRole(token: string, userId: string, newRole: string): Promise<AdminResponse<UserDto>>;
    deleteUser(token: string, userId: string): Promise<AdminResponse<null>>;
    generateReport(token: string, quiz_ids: number[]): Promise<AdminReportResponse>;
}
