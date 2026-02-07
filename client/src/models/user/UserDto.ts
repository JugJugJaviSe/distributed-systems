export interface UserDto {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    gender: string;
    country: string;
    street: string;
    streetNumber: string;
    role: "Player" | "Moderator" | "Admin";
    profilePictureUrl?: string;
}
