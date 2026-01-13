import type { AuthResponse } from "../../types/auth/AuthResponse";

export interface IAuthAPIService {
    login(email: string, password: string): Promise<AuthResponse>;
    register(firstName: string, lastName: string, email: string, password: string, dateOfBirth: Date, gender: string, country: string, street: string, streetNumber: string): Promise<AuthResponse>;
}