import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {IAuthResponse} from "../../models/AuthResponse.ts";
import {AuthService} from "../../services/AuthService.ts";
import {API_URL} from "../../http";
import axios from "axios";

export const fetchAuthLogin = createAsyncThunk<
    IAuthResponse,
    { email: string, password: string },
    { rejectValue: { errors: Array<{ path: string; msg: string }>; message?: string } }
>(
    'auth/fetchAuthLogin',
    async (params, { rejectWithValue }) => {
        try {
            const { data } = await AuthService.login(params.email, params.password);
            return data;
        } catch(err: any) {
            const data = err.response?.data;
            if (data?.errors?.length) {
                return rejectWithValue({ errors: data.errors });
            }

            if (data?.message) {
                return rejectWithValue({ errors: [], message: data.message });
            }
            return rejectWithValue({ errors: [], message: "Неизвестная ошибка" });
        }
    }
)

export const fetchAuthRegister = createAsyncThunk<
    IAuthResponse,
    { email: string, password: string, login: string, avatarUrl?: File },
    { rejectValue: { errors: Array<{ path: string, msg: string}>, message?: string}}
>(
    'auth/fetchAuthRegister',
    async (params, { rejectWithValue } ) => {
        try {
            const { data } = await AuthService.register(params.email, params.login, params.password, params.avatarUrl);
            console.log(data);
            return data;
        } catch(err: any) {
            const data = err.response?.data;
            if (data?.errors?.length) {
                return rejectWithValue({ errors: data.errors });
            }
            if (data?.message) {
                return rejectWithValue({ errors: [], message: data.message });
            }
            return rejectWithValue({ errors: [], message: "Неизвестная ошибка" });
        }
    }
)

export const fetchAuthLogout = createAsyncThunk(
    'auth/fetchAuthLogout',
    async () => {
        await AuthService.logout();
    }
)

export const checkAuth = createAsyncThunk<IAuthResponse, void>(
    'auth/checkAuth',
    async () => {
        const response = await axios.get<IAuthResponse>(`${API_URL}/auth/refresh`, {
            withCredentials: true
        });
        return response.data;
    }
)

export const Status = {
    LOADING: "loading",
    ERROR: "error",
    SUCCESS: "success"
} as const;

export type Status = typeof Status[keyof typeof Status];

interface AuthState {
    data: IAuthResponse | null;
    isAuth: boolean;
    status: Status;
    errors: Array<{ path: string; msg: string }> | null;
    message?: string;
}

const initialState: AuthState = {
    data: null,
    isAuth: false,
    status: Status.LOADING,
    errors: null,
    message: ""
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchAuthLogin.pending, (state) => {
                state.data = null;
                state.status = Status.LOADING;
            })
            .addCase(fetchAuthLogin.fulfilled, (state, action) => {
                state.data = action.payload;
                localStorage.setItem('token', state.data.accessToken);
                state.isAuth = true;
                state.status = Status.SUCCESS;
            })
            .addCase(fetchAuthLogin.rejected, (state, action) => {
                state.data = null;
                state.status = Status.ERROR;
                state.errors = action.payload?.errors || null;
                state.message = action.payload?.message;
            })

            .addCase(fetchAuthRegister.pending, (state) => {
                state.data = null;
                state.status = Status.LOADING;
            })
            .addCase(fetchAuthRegister.fulfilled, (state, action) => {
                state.data = action.payload;
                localStorage.setItem('token', state.data.accessToken);
                state.isAuth = true;
                state.status = Status.SUCCESS;
            })
            .addCase(fetchAuthRegister.rejected, (state, action) => {
                state.data = null;
                state.status = Status.ERROR;
                state.errors = action.payload?.errors || null;
                state.message = action.payload?.message;
            })

            .addCase(fetchAuthLogout.fulfilled, (state) => {
                state.data = null;
                localStorage.removeItem('token');
                state.isAuth = false;
                state.status = Status.SUCCESS;
            })

            .addCase(checkAuth.fulfilled, (state, action) => {
                state.data = action.payload;
                localStorage.setItem('token', state.data.accessToken);
                state.isAuth = true;
                state.status = Status.SUCCESS;
            })

    }
});

export const authReducer = authSlice.reducer;