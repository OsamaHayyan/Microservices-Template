export interface IHttpClient {
    get<R>(url: string, config?: Record<string, any>): Promise<R>;
    post<T,R>(url: string, data: T, config?: Record<string, any>): Promise<R>;
    put<T,R>(url: string, data: T, config?: Record<string, any>): Promise<R>;
    patch<T,R>(url: string, data: T, config?: Record<string, any>): Promise<R>;
    delete<R>(url: string, config?: Record<string, any>): Promise<R>;
}