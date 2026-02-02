import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {PostsService} from "../../services/PostsService.ts";
import type {ITags} from "../../models/PostResponse.ts";

export const fetchPosts = createAsyncThunk<IPost[], void>(
    'posts/fetchPosts',
    async () => {
        const { data } = await PostsService.getAll();
        return data;
    }
);

export const removePost = createAsyncThunk<void, string>(
    'posts/removePost',
    async (id: string) => {
        await PostsService.removePost(id)
    }
);

export const getPostById = createAsyncThunk<IPost, string>(
    'posts/getPostById',
    async (id: string) => {
        const { data } = await PostsService.getById(id);
        return data;
    }
);

export const getPopularTags = createAsyncThunk<ITags[], void>(
    'posts/getPopularTags',
    async () => {
        const { data } = await PostsService.getPopularTags();
        return data;
    }
);

export const getPostsByTag = createAsyncThunk<IPost[], string>(
    'posts/getPostsByTag',
    async (tagId: string) => {
        const { data } = await PostsService.getByTag(tagId);
        return data;
    }
);

export interface IUserDto {
    _id: string;
    email: string;
    login: string;
    avatarUrl?: string;
}

export interface IPost {
    _id: string;
    user: IUserDto;
    title: string;
    text: string;
    imageUrl?: string;
    tags?: string[];
    views: number;
    commentsCount: number;
    createdAt: string;
    updatedAt: string;
}

export const Status = {
    LOADING: "loading",
    ERROR: "error",
    SUCCESS: "success"
} as const;

export type Status = typeof Status[keyof typeof Status];

interface PostsState {
    posts: {
        items: IPost[];
        status: Status;
    };
    tags: {
        items: ITags[];
        status: Status;
    };
    currentPost: {
        item: IPost | null;
        status: Status;
    };
}

const initialState: PostsState = {
    posts: {
        items: [],
        status: Status.LOADING
    },
    tags: {
        items: [],
        status: Status.LOADING
    },
    currentPost: {
        item: null,
        status: Status.LOADING
    }
};

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            //получение всех статей
            .addCase(fetchPosts.pending, (state) => {
                state.posts.items = [];
                state.posts.status = Status.LOADING;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.posts.items = action.payload;
                state.posts.status = Status.SUCCESS;
            })
            .addCase(fetchPosts.rejected, (state) => {
                state.posts.items = [];
                state.posts.status = Status.ERROR;
            })

            //получение статьи по айди
            .addCase(getPostById.fulfilled, (state, action) => {
                state.currentPost.item = action.payload;
            })

            //получение тегов
            .addCase(getPopularTags.pending, (state) => {
                state.tags.items = [];
                state.tags.status = Status.LOADING;
            })
            .addCase(getPopularTags.fulfilled, (state, action) => {
                state.tags.items = action.payload;
                state.tags.status = Status.SUCCESS;
            })
            .addCase(getPopularTags.rejected, (state) => {
                state.tags.items = [];
                state.tags.status = Status.ERROR;
            })

            //посты по тегу
            .addCase(getPostsByTag.pending, (state) => {
                state.posts.items = [];
                state.posts.status = Status.LOADING;
            })
            .addCase(getPostsByTag.fulfilled, (state, action) => {
                state.posts.items = action.payload;
                state.posts.status = Status.SUCCESS;
            })
            .addCase(getPostsByTag.rejected, (state) => {
                state.posts.items = [];
                state.posts.status = Status.ERROR;
            })

            //удаление поста
            .addCase(removePost.pending, (state, action) => {
                state.posts.items = state.posts.items.filter(obj => obj._id !== action.meta.arg);
            })
    }
});

export const postsReducer = postsSlice.reducer;