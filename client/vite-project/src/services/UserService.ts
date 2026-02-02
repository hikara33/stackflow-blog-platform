import $api from "../http";
import {type AxiosResponse} from "axios";
import type {UserResponse} from "../models/UserResponse.ts";
import type {CommentResponse} from "../models/CommentResponse.ts";
import type {IPost} from "../redux/slices/posts-slice.ts";
import type {IUser} from "../models/AuthResponse.ts";

export interface updateDataI {
    login: string;
    email: string;
    bio: string;
    website: string;
    location: string;
    avatarUrl?: File | null;
}

export class UserService {
    static async getUserInfo(id: string): Promise<AxiosResponse<UserResponse>> {
        return $api.get<UserResponse>(`/auth/users/${id}`);
    }

    static async getUserComments(id: string): Promise<AxiosResponse<CommentResponse[]>> {
        return $api.get<CommentResponse[]>(`/auth/users/${id}/comments`);
    }

    static async getUserPosts(id: string): Promise<AxiosResponse<IPost[]>> {
        return $api.get<IPost[]>(`/auth/users/${id}/posts`);
    }

    static async updateUserInfo(id: string, data: updateDataI): Promise<AxiosResponse<IUser>> {
        const formData = new FormData();
        formData.append('login', data.login);
        formData.append('email', data.email);
        formData.append('bio', data.bio);
        formData.append('website', data.website);
        formData.append('location', data.location);

        if (data.avatarUrl) {
            formData.append('avatar', data.avatarUrl);
        }

        return $api.patch<IUser>(`auth/users/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
}