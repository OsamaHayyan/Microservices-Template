import HttpClient from '@/utils/AxiosAdapter';
import {SignUpReq, SignUpRes} from "@/types/AuthenticationTypes/SignUpTypes.ts";
import {LoginReq, LoginRes} from "@/types/AuthenticationTypes/LoginTypes.ts";

class AuthenticationRepository {
    private readonly httpClient: HttpClient;

    constructor() {
        this.httpClient = new HttpClient({baseURL: `${import.meta.env.VITE_BACKEND_API}/auth`, timeout: 5000});
    }

    async signUp(signUpDate: SignUpReq) {
        try {
            return await this.httpClient.post<SignUpReq, SignUpRes>(`/signup`, signUpDate);
        } catch (error) {
            console.error('Error while signup', error);
            throw error
        }
    }

    async login(loginData: LoginReq) {
        try {
            return await this.httpClient.post<LoginReq, LoginRes>(`/login`, loginData, {withCredentials: true});
        } catch (error) {
            console.error('Error while login', error);
            throw error
        }
    }

    async logout() {
        try {
            console.log("test here")
            return await this.httpClient.post(`/logout`, null, {withCredentials: true});
        } catch (error) {
            console.error('Error while logout', error);
            throw error;
        }
    }

}

export default new AuthenticationRepository;
