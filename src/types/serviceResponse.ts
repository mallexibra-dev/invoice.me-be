export interface ServiceResponse<T = any>{
    error: boolean;
    status?: number;
    message?: string;
    data?: T;
}