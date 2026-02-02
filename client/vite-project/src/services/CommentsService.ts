import $api from "../http";
import type {AxiosResponse} from "axios";
import type {CommentResponse} from "../models/CommentResponse.ts";

export class CommentsService {
    static async getAllComments(postId: string): Promise<AxiosResponse<CommentResponse[]>> {
        return $api.get<CommentResponse[]>(`/comments/post/${postId}`);
    }

    static async createComment(postId: string, content: string): Promise<AxiosResponse<CommentResponse>> {
        return $api.post<CommentResponse>('/comments', {postId, content});
    }

    static async removeComment(id: string): Promise<void> {
        $api.delete(`/comments/${id}`);
    }

    static async updateComment(id: string, content: string): Promise<AxiosResponse<CommentResponse>> {
        return $api.patch(`/comments/${id}`, {content});
    }

    static async getUserComments(): Promise<AxiosResponse<CommentResponse[]>> {
        return $api.get<CommentResponse[]>('/comments/user');
    }
}