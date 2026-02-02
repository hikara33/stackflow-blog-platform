import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {CommentsService} from "../../services/CommentsService.ts";
import type {CommentResponse} from "../../models/CommentResponse.ts";

export const fetchComments = createAsyncThunk<CommentResponse[], string>(
    'comments/fetchComments',
    async (id: string) => {
        const { data } = await CommentsService.getAllComments(id);
        return data;
    }
);

export const createComment = createAsyncThunk<
    CommentResponse,
    {postId: string, content: string}
>(
    'comments/createComment',
    async ({postId, content}) => {
        const { data } = await CommentsService.createComment(postId, content);
        return data;
    }
);

export const deleteComment = createAsyncThunk<void, string>(
    'comments/deleteComment',
    async (id: string) => {
        await CommentsService.removeComment(id);
    }
);

export const updateComment = createAsyncThunk<
    CommentResponse,
    {id: string, content: string}
>(
    'comments/updateComment',
    async ({id, content}) => {
        const { data } = await CommentsService.updateComment(id, content);
        return data;
    }
);

export const getUserComments = createAsyncThunk<CommentResponse[], void>(
    'comments/getUserComments',
    async () => {
        const { data } = await CommentsService.getUserComments();
        return data;
    }
);

export const Status = {
    LOADING: "loading",
    ERROR: "error",
    SUCCESS: "success"
} as const;

export type Status = typeof Status[keyof typeof Status];

interface CommentsState {
    comments: {
        items: CommentResponse[];
        status: Status;
    };
    userComments: {
        items: CommentResponse[];
        status: Status;
    }
}

const initialState: CommentsState = {
    comments: {
        items: [],
        status: Status.LOADING
    },
    userComments: {
        items: [],
        status: Status.LOADING
    }
};

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            //получение всех коммов
            .addCase(fetchComments.pending, (state) => {
                state.comments.items = [];
                state.comments.status = Status.LOADING;
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.comments.items = action.payload;
                state.comments.status = Status.SUCCESS;
            })
            .addCase(fetchComments.rejected, (state) => {
                state.comments.items = [];
                state.comments.status = Status.ERROR;
            })

            //добавление коммента
            .addCase(createComment.fulfilled, (state, action) => {
                state.comments.items.push(action.payload);
                state.comments.status = Status.SUCCESS;
            })

            //удаление коммента
            .addCase(deleteComment.pending, (state, action) => {
                state.comments.items = state.comments.items.filter(obj => obj._id !== action.meta.arg);
            })

            //получение комментариев юзера
            .addCase(getUserComments.fulfilled, (state, action) => {
                state.userComments.items = action.payload;
            })
    }
});

export const commentsReducer = commentsSlice.reducer;



