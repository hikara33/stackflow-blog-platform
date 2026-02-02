import React, {useEffect} from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {useForm} from "react-hook-form";
import {useAppDispatch, useAppSelector} from "../redux/store.ts";
import {fetchAuthLogin} from "../redux/slices/auth-slice.ts";
import {useNavigate} from "react-router-dom";

interface LoginFormValues {
    email: string;
    password: string;
}

export const Login: React.FC = () => {
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isValid }
    } = useForm<LoginFormValues>({
        defaultValues: {
            email: '',
            password: ''
        },
        mode: 'onChange'
    });
    const dispatch = useAppDispatch();
    const { isAuth, errors: serverErrors, message: serverMsg } = useAppSelector(state => state.auth);

    useEffect(() => {
        if (serverErrors?.length) {
            serverErrors.forEach((err) => {
                setError(err.path as keyof LoginFormValues, { message: err.msg });
            })
        }

        if (serverMsg) {
            setError('root', { message: serverMsg });
        }
    }, [serverErrors, serverMsg, setError]);

    const onSubmit = (values: LoginFormValues) => {
        dispatch(fetchAuthLogin(values));
    }

    const navigate = useNavigate();
    if (isAuth) {
        navigate('/');
    }

    return (
        <Paper className='w-[400px] p-[50px] border border-gray-300 mx-auto my-[50px]'>
            <div className='text-center font-bold mb-7.5'>
                <Typography
                    variant='h5'>
                    Вход в аккаунт</Typography>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                {errors.root && (
                    <div className='text-center mb-4'>
                        <Typography color="error">{errors.root.message}</Typography>
                    </div>
                )}
                <div className='mb-2.5'>
                    <TextField
                        label="E-Mail"
                        error={Boolean(errors.email?.message)}
                        helperText={errors.email?.message}
                        fullWidth
                        {...register('email', { required: 'Укажите почту'})}
                    />
                </div>
                <div className="mb-5">
                    <TextField
                        label="Пароль"
                        error={Boolean(errors.password?.message)}
                        helperText={errors.password?.message}
                        fullWidth
                        {...register('password', { required: 'Укажите пароль'})}
                    />
                </div>
                <Button disabled={!isValid} type='submit' size="large" variant="contained" fullWidth>
                    Войти
                </Button>
            </form>
        </Paper>
    );
};