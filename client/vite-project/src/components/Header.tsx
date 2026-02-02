import React from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {Link, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../redux/store.ts";
import {fetchAuthLogout} from "../redux/slices/auth-slice.ts";

export const Header: React.FC = () => {
    const { isAuth, data } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();

    const onClickLogout = () => {
        dispatch(fetchAuthLogout());
    };

    const navigate = useNavigate();
    const onClickProfile = () => {
        navigate(`/profile/${data?.user.id}`);
    };

    return(
        <div className='bg-white py-2 border-b border-gray-300 mb-7'>
            <Container maxWidth='lg'>
                <div className='flex justify-between items-center'>
                    <Link to="/" className="bg-black text-white font-bold uppercase tracking-wide rounded px-3 py-1 hover:bg-blue-600">
                        StackFlow
                    </Link>
                    <div className='flex items-center'>
                        {isAuth ? (
                            <>
                                <Button onClick={onClickProfile} variant="contained"
                                style={{marginRight: '10px'}}>Личный кабинет</Button>
                                <Link to="/add-post" className="mr-2">
                                    <Button variant="contained">Написать статью</Button>
                                </Link>
                                <Button onClick={onClickLogout} variant="contained" color="error">
                                    Выйти
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="mr-2">
                                    <Button variant="outlined">Войти</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="contained">Создать аккаунт</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
};