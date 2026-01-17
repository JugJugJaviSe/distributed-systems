import type { UserDto } from "../models/UserDto";

/**
 * Backend (API) representation – snake_case
 */
export type UserApi = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string | null;
  gender: string | null;
  country: string | null;
  street: string | null;
  street_number: string | number | null;
  role: "Player" | "Moderator" | "Admin";
  profile_picture_url?: string | null;
};


export const mapUserApiToDto = (u: UserApi): UserDto => ({
  id: u.id,
  firstName: u.first_name,
  lastName: u.last_name,
  email: u.email,
  dateOfBirth: u.date_of_birth ?? "",
  gender: u.gender ?? "",
  country: u.country ?? "",
  street: u.street ?? "",
  streetNumber: u.street_number !== null ? String(u.street_number) : "",
  role: u.role,
  profilePictureUrl: u.profile_picture_url ?? undefined,
});


export const mapUserDtoToApi = (
  dto: Partial<UserDto>
): Record<string, unknown> => ({
  ...(dto.firstName !== undefined && { first_name: dto.firstName }),
  ...(dto.lastName !== undefined && { last_name: dto.lastName }),
  ...(dto.email !== undefined && { email: dto.email }),
  ...(dto.dateOfBirth !== undefined && { date_of_birth: dto.dateOfBirth }),
  ...(dto.gender !== undefined && { gender: dto.gender }),
  ...(dto.country !== undefined && { country: dto.country }),
  ...(dto.street !== undefined && { street: dto.street }),
  ...(dto.streetNumber !== undefined && { street_number: dto.streetNumber }),
});
