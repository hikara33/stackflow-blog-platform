import $api from "../http";
import type {AxiosResponse} from "axios";
import type {IPost} from '../redux/slices/posts-slice.ts';
import type {ITags} from "../models/PostResponse.ts";

interface INewPost {
    title: string;
    text: string;
    tags?: string[];
    imageUrl?: string;
}

export class PostsService {
    static async createPost(post: INewPost): Promise<AxiosResponse<IPost>> {
        return $api.post<IPost>('/posts', post);
    }

    static async getAll(): Promise<AxiosResponse<IPost[]>> {
        return $api.get<IPost[]>('/posts');
    }

    static async getById(id: string): Promise<AxiosResponse<IPost>> {
        return $api.get<IPost>('/posts/' + id);
    }

    static async removePost(id: string): Promise<void> {
        $api.delete<IPost>(`/posts/${id}`);
    }

    static async patchPost(post: INewPost, id: string): Promise<AxiosResponse<IPost>> {
        return $api.patch<IPost>(`/posts/${id}`, post);
    }

    static async getPopularTags(): Promise<AxiosResponse<ITags[]>> {
        return $api.get<ITags[]>('/posts/tags');
    }

    static async getByTag(tagId: string): Promise<AxiosResponse<IPost[]>> {
        return $api.get<IPost[]>('/tags/' + tagId);
    }
}
