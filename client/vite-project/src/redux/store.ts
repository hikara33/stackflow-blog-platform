import { configureStore } from "@reduxjs/toolkit";
import {postsReducer} from "./slices/posts-slice.ts";
import {type TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {authReducer} from "./slices/auth-slice.ts";
import {commentsReducer} from "./slices/comments-slice.ts";
import {userReducer} from "./slices/user-slice.ts";

const store = configureStore({
    reducer: {
        posts: postsReducer,
        auth: authReducer,
        comments: commentsReducer,
        user: userReducer
    }
});

type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;