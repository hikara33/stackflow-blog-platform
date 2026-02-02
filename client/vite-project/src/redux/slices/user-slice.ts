import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type {UserResponse} from "../../models/UserResponse.ts";
import type {IPost} from "./posts-slice.ts";
import type {CommentResponse} from "../../models/CommentResponse.ts";
import {type updateDataI, UserService} from "../../services/UserService.ts";
import type {IUser} from "../../models/AuthResponse.ts";

export const fetchUserInfo = createAsyncThunk<UserResponse, string>(
    'user/fetchUserInfo',
    async (id: string) => {
        const { data } = await UserService.getUserInfo(id);
        return data;
    }
);

export const fetchUserUpdate = createAsyncThunk<
    IUser,
    {
        id: string,
        updateData: updateDataI
    }
>(
    'user/fetchUserUpdate',
    async ({ id, updateData }) => {
        const { data } = await UserService.updateUserInfo(id, updateData);
        return data;
    }
);

export const fetchUserComments = createAsyncThunk<CommentResponse[], string>(
    'user/fetchUserComments',
    async (id: string) => {
        const { data } = await UserService.getUserComments(id);
        return data;
    }
);

export const fetchUserPosts = createAsyncThunk<IPost[], string>(
    'user/fetchUserPosts',
    async (id: string) => {
        const { data } = await UserService.getUserPosts(id);
        return data;
    }
);

export const Status = {
    LOADING: "loading",
    ERROR: "error",
    SUCCESS: "success"
} as const;

export type Status = typeof Status[keyof typeof Status];

interface UserState {
    profile: {
        items: UserResponse | null;
        status: Status;
    };
    posts: {
        items: IPost[];
        status: Status;
    };
    comments: {
        items: CommentResponse[];
        status: Status;
    };
}

const initialState: UserState = {
    profile: {
        items: null,
        status: Status.LOADING
    },
    posts: {
        items: [],
        status: Status.LOADING
    },
    comments: {
        items: [],
        status: Status.LOADING
    }
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            //профайл юзера
            .addCase(fetchUserInfo.pending, (state) => {
                state.profile.items = null;
                state.profile.status = Status.LOADING;
            })
            .addCase(fetchUserInfo.fulfilled, (state, action) => {
                state.profile.items = action.payload;
                state.profile.status = Status.SUCCESS;
            })
            .addCase(fetchUserInfo.rejected, (state) => {
                state.profile.items = null;
                state.profile.status = Status.ERROR;
            })

            //коммы юзера
            .addCase(fetchUserComments.pending, (state) => {
                state.comments.items = [];
                state.comments.status = Status.LOADING;
            })
            .addCase(fetchUserComments.fulfilled, (state, action) => {
                state.comments.items = action.payload;
                state.comments.status = Status.SUCCESS;
            })
            .addCase(fetchUserComments.rejected, (state) => {
                state.comments.items = [];
                state.comments.status = Status.ERROR;
            })

            //посты юзера
            .addCase(fetchUserPosts.pending, (state) => {
                state.posts.items = [];
                state.posts.status = Status.LOADING;
            })
            .addCase(fetchUserPosts.fulfilled, (state, action) => {
                state.posts.items = action.payload;
                state.posts.status = Status.SUCCESS;
            })
            .addCase(fetchUserPosts.rejected, (state) => {
                state.posts.items = [];
                state.posts.status = Status.ERROR;
            })
    }
});

export const userReducer = userSlice.reducer;