import axios, {AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults} from 'axios';
import {IHttpClient} from '@/interfaces/IHttpClient';
import errorResponse from '@/utils/errorResponse';

class AxiosAdapter implements IHttpClient {
    private readonly axiosInstance: AxiosInstance;

    constructor(config?: CreateAxiosDefaults) {
        this.axiosInstance = axios.create({
            ...config,
            timeout: config?.timeout || 30000,
        });
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
                status: e.response?.status
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
}

export default AxiosAdapter;