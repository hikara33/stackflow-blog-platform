export interface IUser {
    email: string;
    isActivated: boolean;
    id: string;
    role: string;
    avatarUrl: string;
}

export interface IAuthResponse {
    accessToken: string;
    refreshToken: string;
    user: IUser;
}