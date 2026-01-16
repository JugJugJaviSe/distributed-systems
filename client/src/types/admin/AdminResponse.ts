export interface AdminResponse<T> {
    success: boolean;
    message: string;
    data: T | null;
}
