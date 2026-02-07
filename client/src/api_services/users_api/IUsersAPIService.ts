import type { UserDto } from "../../models/user/UserDto";
import type { UserResponse } from "../../types/user/UserResponse";

export interface IUsersAPIService {
  getMe(token: string): Promise<UserResponse<UserDto>>;
  updateMe(token: string, updatedData: Partial<UserDto>): Promise<UserResponse<UserDto>>;
}
