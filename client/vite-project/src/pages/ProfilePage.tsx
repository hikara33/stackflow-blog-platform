import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Avatar, Tabs, Tab, Typography, Paper, Divider, Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { Post } from "../components";
import UserComments from "../components/UserComments";
import noAvatar from "../assets/noavatar.png";
import {fetchUserComments, fetchUserInfo, fetchUserPosts} from "../redux/slices/user-slice.ts";

export const ProfilePage: React.FC = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const { profile, comments, posts } = useAppSelector(state => state.user);
    const isProfileLoading = profile.status === 'loading';
    const { data } = useAppSelector(state => state.auth);

    const [tab, setTab] = useState(0);

    useEffect(() => {
        if (id) {
            dispatch(fetchUserInfo(id));
            dispatch(fetchUserComments(id));
            dispatch(fetchUserPosts(id));
        }
    }, [id]);

    if (!profile.items || isProfileLoading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <Paper className="p-6 border border-gray-300">
                    <Typography>Загрузка профиля...</Typography>
                </Paper>
            </div>
        )
    }

    const isOwner = profile?.items?._id === data?.user.id;
    return (
        <div className="max-w-5xl mx-auto p-6">

            <Paper className="p-6 border border-gray-300 mb-6">
                <div className="flex items-center gap-6">

                    <Avatar
                        sx={{ width: 120, height: 120 }}
                        src={profile.items.avatarUrl ? `http://localhost:5000/${profile.items.avatarUrl}` : noAvatar}
                    />

                    <div className="flex flex-col">
                        <Typography variant="h4" fontWeight="bold">
                            {profile.items.login}
                        </Typography>

                        <Typography variant="body1" className="text-gray-600 mt-1">
                            {profile.items.bio ? profile.items.bio : 'Нет описания...'}
                        </Typography>

                        <div className="flex gap-4 mt-3 text-gray-700">
                            <div>
                                <strong>{posts.items.length}</strong> публикаций
                            </div>
                            <div>
                                <strong>{comments.items.length}</strong> комментариев
                            </div>
                        </div>

                        <Typography variant="caption" className="text-gray-500 mt-2">
                            На сайте с {new Date(profile.items.createdAt).toLocaleString()}
                        </Typography>

                        {isOwner && (
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2, width: "200px" }}
                                href="/profile/edit"
                            >
                                Редактировать профиль
                            </Button>
                        )}
                    </div>
                </div>
            </Paper>

            <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                sx={{ mb: 3 }}
            >
                <Tab label="Публикации" />
                <Tab label="Комментарии" />
                <Tab label="Информация" />
            </Tabs>

            {tab === 0 && (
                <div className="space-y-5">
                    {posts.items.length === 0 ? (
                        <Typography variant="h6" className="text-gray-500">
                            У пользователя пока нет публикаций
                        </Typography>
                    ) : (
                        posts.items.map(post => (
                            <Post
                                key={post._id}
                                _id={post._id}
                                title={post.title}
                                imageUrl={post.imageUrl}
                                user={post.user}
                                createdAt={post.createdAt}
                                viewsCount={post.views}
                                commentsCount={post.commentsCount}
                                tags={post.tags}
                                isEditable={isOwner}
                            />
                        ))
                    )}
                </div>
            )}

            {tab === 1 && (
                <UserComments
                    items={comments.items}
                    isLoading={false}
                />
            )}

            {tab === 2 && (
                <Paper className="p-6 border border-gray-300">
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                        Личная информация
                    </Typography>

                    <Divider className="my-3" />

                    <div className="space-y-3 text-gray-800 mt-4">
                        <p><strong>Email: </strong>{profile.items.email}</p>
                        <p><strong>Локация: </strong>{profile.items.location || "Не указано"}</p>
                        <p><strong>Сайт: </strong>{
                            profile.items.website ? (
                                <a href={profile.items.website}
                                className='hover:text-blue-600 hover:underline transition-colors'>
                                    {profile.items.website}</a>
                            ) : 'Не указано'
                        }</p>
                        <p><strong>О себе: </strong>{profile.items.bio || "Не заполнено"}</p>
                    </div>
                </Paper>
            )}
        </div>
    );
};
