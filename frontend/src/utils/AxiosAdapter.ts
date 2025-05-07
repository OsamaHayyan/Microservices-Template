import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    CreateAxiosDefaults,
    InternalAxiosRequestConfig
} from 'axios';
import {IHttpClient} from '@/interfaces/IHttpClient';
import errorResponse from '@/utils/errorResponse';
import {jwtDecode} from "jwt-decode";
import dayjs from "dayjs";
import {RefreshTokenRes} from "@/types/AuthenticationTypes/RefreshTokenTypes.ts";
import {getTokenLocalStorage, removeTokenLocalStorage, setTokenLocalStorage} from "@/utils/TokenLocalStorage.ts";
import {isIncludeText} from "@/utils/isIncludeText.ts";

class AxiosAdapter implements IHttpClient {
    private readonly axiosInstance: AxiosInstance;
    private readonly refreshTokenEndpoint = `/refresh-token`;
    constructor(config?: CreateAxiosDefaults) {
        this.axiosInstance = axios.create({
            ...config,
            timeout: config?.timeout || 30000,
        });

        this.axiosInstance.interceptors.request.use(async req => {
            return await this.CheckTokenExpAndRefresh(req);
        })

        this.axiosInstance.interceptors.response.use(
            response => response,
            async (error: AxiosError) => {
                return await this.refreshTokenOnUnauthorizedResponse(error);
            }
        )
    }

    async delete<R>(url: string, config?: AxiosRequestConfig): Promise<R> {
        try {
            const {data} = await this.axiosInstance.delete<R>(url, config);
            return data;
        } catch (e: any) {
            throw errorResponse({
                message: e.response?.data?.message || e.message,
                error: e.response?.data?.error,
                status: e.response?.status
            });
        }
    }

    async get<R>(url: string, config?: AxiosRequestConfig): Promise<R> {
        try {
            const {data} = await this.axiosInstance.get<R>(url, config);
            return data;
        } catch (e: any) {
            throw errorResponse({
                message: e.response?.data?.message || e.message,
                error: e.response?.data?.error,
                status: e.response?.status
            });
        }
    }

    async patch<T, R>(url: string, data: T, config?: AxiosRequestConfig): Promise<R> {
        try {
            const response = await this.axiosInstance.patch<R>(url, data, config);
            return response.data;
        } catch (e: any) {
            throw errorResponse({
                message: e.response?.data?.message || e.message,
                error: e.response?.data?.error,
                status: e.response?.status
            });
        }
    }

    async post<T, R>(url: string, data: T, config?: AxiosRequestConfig): Promise<R> {
        try {
            const response = await this.axiosInstance.post<R>(url, data, config);
            return response.data;
        } catch (e: any) {
            throw errorResponse({
                message: e.response?.data?.message || e.message,
                error: e.response?.data?.error,
                status: e.response?.statusCode
            });
        }
    }

    async put<T, R>(url: string, data: T, config?: AxiosRequestConfig): Promise<R> {
        try {
            const response = await this.axiosInstance.put<R>(url, data, config);
            return response.data;
        } catch (e: any) {
            throw errorResponse({
                message: e.response?.data?.message || e.message,
                error: e.response?.data?.error,
                status: e.response?.status
            });
        }
    }

    private async CheckTokenExpAndRefresh(req: InternalAxiosRequestConfig) {
        if (isIncludeText(req.url, [this.refreshTokenEndpoint, '/logout'])) {
            return req;
        }

        const user = getTokenLocalStorage();
        if (user?.accessToken) {
            const decodedToken = jwtDecode(user.accessToken);
            const isTokenExpired = dayjs.unix(decodedToken.exp as number).isBefore(dayjs());
            if (isTokenExpired) {
                const {data} = await this.axiosInstance.post<RefreshTokenRes>(this.refreshTokenEndpoint, null, {withCredentials: true});
                setTokenLocalStorage(data)
                window.dispatchEvent(new CustomEvent('tokenRefreshed', { detail: data }));
                req.headers['Authorization'] = `Bearer ${data.accessToken}`;
            }
        }
        return req;
    }

    private async refreshTokenOnUnauthorizedResponse (error: AxiosError) {
        const originalRequest = error.config as AxiosRequestConfig & { retry?: boolean };
        if (isIncludeText(originalRequest.url, [this.refreshTokenEndpoint, '/logout'])) {
            return this.axiosInstance(originalRequest);
        }
        if (error.response?.status === 401 && !originalRequest.retry) {
            try {
                originalRequest.retry = true;
                const {data} = await this.axiosInstance.post<RefreshTokenRes>(this.refreshTokenEndpoint, null, {withCredentials: true});
                setTokenLocalStorage(data);
                window.dispatchEvent(new CustomEvent('tokenRefreshed', { detail: data }));
                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${data.accessToken}`,
                };
                return this.axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed on 401:', refreshError);
                removeTokenLocalStorage()
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
}

export default AxiosAdapter;