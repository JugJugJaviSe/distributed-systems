import axios from "axios";
import type { IAdminAPIService } from "./IAdminAPIService";
import type { AdminResponse } from "../../types/admin/AdminResponse";
import type { UserDto } from "../../models/UserDto";

const API_URL: string = import.meta.env.VITE_API_URL + "/admin";

export const adminApi: IAdminAPIService = {
    async listUsers(): Promise<AdminResponse<UserDto[]>> {
        try {
            const res = await axios.get<AdminResponse<UserDto[]>>(`${API_URL}/users`);
            return res.data;
        } catch (error) {
            let message = "Failed to fetch users";
            if (axios.isAxiosError(error)) message = error.response?.data?.message || message;

            return { success: false, message, data: null };
        }
    },

    async changeUserRole(userId: string, newRole: string): Promise<AdminResponse<UserDto>> {
        try {
            const payload = { user_id: userId, new_role: newRole };
            const res = await axios.post<AdminResponse<UserDto>>(`${API_URL}/change-role`, payload);
            return res.data;
        } catch (error) {
            let message = "Failed to change user role";
            if (axios.isAxiosError(error)) message = error.response?.data?.message || message;

            return { success: false, message, data: null };
        }
    },

    async deleteUser(userId: string): Promise<AdminResponse<null>> {
        try {
            const res = await axios.delete<AdminResponse<null>>(`${API_URL}/delete-user/${userId}`);
            return res.data;
        } catch (error) {
            let message = "Failed to delete user";
            if (axios.isAxiosError(error)) message = error.response?.data?.message || message;

            return { success: false, message, data: null };
        }
    }
};