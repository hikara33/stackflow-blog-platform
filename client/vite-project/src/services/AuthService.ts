import $api from "../http";
import {type AxiosResponse} from "axios";
import type {IAuthResponse} from "../models/AuthResponse.ts";

export class AuthService {
    static async login(email: string, password: string): Promise<AxiosResponse<IAuthResponse>> {
        return $api.post<IAuthResponse>('/auth/login', {email, password});
    }

    static async register(email: string, login: string, password: string, avatarUrl?: File): Promise<AxiosResponse<IAuthResponse>> {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("login", login);

        if (avatarUrl) {
            formData.append("avatar", avatarUrl);
        }

        return $api.post<IAuthResponse>('/auth/registration', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }

    static async logout(): Promise<void> {
        return $api.post('/auth/logout');
    }
}