interface IOwner {
    _id: string;
    login: string;
    avatarUrl: string;
}

export interface CommentResponse {
    user: IOwner;
    postId: string;
    content: string;
    parentComment: null;
    _id: string;
    createdAt: string;
    updatedAt: string;
}