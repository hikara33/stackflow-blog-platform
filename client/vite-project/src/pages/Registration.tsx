import React, {useEffect, useRef, useState} from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import {useForm} from "react-hook-form";
import {useAppDispatch, useAppSelector} from "../redux/store.ts";
import {fetchAuthRegister} from "../redux/slices/auth-slice.ts";
import {useNavigate} from "react-router-dom";

interface RegisterFormValues {
    email: string;
    password: string;
    login: string;
    avatarUrl?: File;
}

export const Registration: React.FC = () => {
    const {isAuth, errors: serverErrors, message: serverMessage} = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        formState: { errors, isValid }
    } = useForm<RegisterFormValues>({
        defaultValues: {
            email: '',
            password: '',
            login: '',
            avatarUrl: undefined
        },
        mode: 'onChange'
    });

    useEffect(() => {
        if (serverErrors?.length) {
            serverErrors.forEach((err) => {
                setError(err.path as keyof RegisterFormValues, { message: err.msg });
            })
        }
        if (serverMessage) {
            setError('root', { message: serverMessage });
        }
    }, [serverErrors, serverMessage, setError]);

    const [preview, setPreview] = useState<string | null>(null);
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setValue('avatarUrl', file);
        setPreview(URL.createObjectURL(file));
    };

    const onSubmit = (values: RegisterFormValues) => {
        dispatch(fetchAuthRegister(values));
    }

    const navigate = useNavigate();
    if (isAuth) {
        navigate('/');
    }

    const inputRef = useRef<HTMLInputElement>(null);
    const handleAvatarClick = () => {
        inputRef.current?.click();
    }
    const handleRemoveAvatar = () => {
        setPreview(null);
        setValue('avatarUrl', undefined);
    }

    return (
        <Paper className='w-[400px] p-[50px] border border-gray-300 mx-auto my-[50px]'>
            <Typography sx={{mb: 2, fontWeight: 'bold', textAlign: 'center'}} variant="h5">
                Создание аккаунта
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                {errors.root && (
                    <div className='text-center mb-4'>
                        <Typography color="error">{errors.root.message}</Typography>
                    </div>
                )}

                <div className='flex justify-center mb-4.5'>
                    <Avatar sx={{ width: 100, height: 100 }} src={preview || undefined}/>
                </div>

                <input
                    ref={inputRef}
                    type='file'
                    accept='image/*'
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                />

                <div className='flex justify-between mb-4.5'>
                    <button type="button" onClick={handleAvatarClick} style={{
                        padding: '6px 8px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: 16,
                    }}>
                        Выбрать аватар
                    </button>

                    <button type='button'
                            onClick={handleRemoveAvatar}
                            className='bg-gray-500 py-2 px-1 text-[13px] rounded-sm text-white cursor-pointer'
                            style={{display: preview ? 'block' : 'none'}}
                    >
                        Удалить аватар
                    </button>
                </div>

                <TextField sx={{mb: 1.5}} label="Логин"
                           error={Boolean(errors.login?.message)}
                           helperText={errors.login?.message}
                           fullWidth
                           {...register('login', { required: 'Укажите логин' })}
                />
                <TextField sx={{mb: 1.5}} label="E-Mail"
                           error={Boolean(errors.email?.message)}
                           helperText={errors.email?.message}
                           fullWidth
                           {...register('email', { required: 'Укажите почту' })}
                />
                <TextField sx={{mb: 1.5}} label="Пароль"
                           error={Boolean(errors.password?.message)}
                           helperText={errors.password?.message}
                           fullWidth
                           {...register('password', { required: 'Укажите пароль' })}
                />
                <Button disabled={!isValid} type='submit' size="large" variant="contained" fullWidth>
                    Зарегистрироваться
                </Button>
            </form>
        </Paper>
    );
};