import React, {useState, useEffect, useRef} from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
// import { fetchUserInfo, updateUserProfile } from "../redux/slices/user-slice";
import { useNavigate } from "react-router-dom";

import {
    Avatar,
    Paper,
    Typography,
    TextField,
    Button,
    Divider,
} from "@mui/material";
import noAvatar from "../assets/noavatar.png";
import {fetchUserInfo, fetchUserUpdate} from "../redux/slices/user-slice.ts";
import type {updateDataI} from "../services/UserService.ts";

export const EditProfilePage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { profile } = useAppSelector(state => state.user);
    const { data } = useAppSelector(state => state.auth);
    const id = data?.user.id;

    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [website, setWebsite] = useState("");
    const [location, setLocation] = useState("");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            dispatch(fetchUserInfo(id));
        }
    }, [id]);

    const submitUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        const updateData: updateDataI = {
            email,
            login,
            bio,
            website,
            location,
            avatarUrl: avatar
        };
        dispatch(fetchUserUpdate({ id, updateData }))
            .unwrap()
            .then(() => navigate(`/profile/${id}`))
            .catch((err) => console.error(err));
    }

    useEffect(() => {
        if (profile.items) {
            setLogin(profile.items.login || '');
            setEmail(profile.items.email || '');
            setBio(profile.items.bio || '');
            setWebsite(profile.items.website || '');
            setLocation(profile.items.location || '');

            setAvatarPreview(profile.items.avatarUrl
                ? `http://localhost:5000/${profile.items.avatarUrl}`
                : noAvatar
            );
        }
    }, [profile.items]);

    const removeClick = () => {
        navigate(`/profile/${id}`);
    }

    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleChangeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setAvatar(file);
        setAvatarPreview(URL.createObjectURL(file));
    }

    const changeClick = () => {
        inputRef.current?.click();
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <Paper className="p-6 border border-gray-300">
                <Typography variant="h5" fontWeight="bold" mb={3}>
                    Редактировать профиль
                </Typography>

                <Divider className="mb-6" />

                <form className="space-y-5 mt-3">
                    <div className="flex items-center gap-6">
                        <Avatar
                            sx={{ width: 100, height: 100 }}
                            src={avatarPreview || noAvatar}
                        />
                        <Button
                            variant="outlined"
                            component="label"
                            onClick={changeClick}
                        >
                            Загрузить аватар
                            <input
                                ref={inputRef}
                                onChange={handleChangeAvatar}
                                type="file"
                                hidden
                                accept="image/*"
                            />
                        </Button>
                    </div>

                    <TextField
                        style={{marginBottom: '7px'}}
                        fullWidth
                        label="Логин"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />

                    <TextField
                        style={{marginBottom: '7px'}}
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <TextField
                        style={{marginBottom: '7px'}}
                        fullWidth
                        label="О себе"
                        multiline
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />

                    <TextField
                        style={{marginBottom: '7px'}}
                        fullWidth
                        label="Сайт"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                    />

                    <TextField
                        fullWidth
                        label="Локация"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />

                    <div className="flex justify-end gap-3 mt-4">
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={removeClick}
                        >
                            Отмена
                        </Button>
                        <Button
                            onClick={submitUpdate}
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Сохранить
                        </Button>
                    </div>
                </form>
            </Paper>
        </div>
    );
};

export default EditProfilePage;