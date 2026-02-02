import React, {type ReactNode, useState} from 'react';
import {SideBlock} from "./SideBlock.tsx";

import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import type {CommentResponse} from "../models/CommentResponse.ts";
import { Box, Button, TextField, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Clear";
import {useAppDispatch, useAppSelector} from "../redux/store.ts";
import {getPostById, type IPost} from "../redux/slices/posts-slice.ts";
import {deleteComment, fetchComments, updateComment} from "../redux/slices/comments-slice.ts";

interface CommentsProps {
    items: CommentResponse[];
    post: IPost | null;
    children?: ReactNode;
    isLoading?: boolean;
}

export const CommentsBlock: React.FC<CommentsProps> = ({ items, post, children, isLoading = true }) => {
    const { data } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();

    const handleDelete = (id: string) => {
        if (window.confirm('Вы точно хотите удалить комментарий?')) {
            dispatch(deleteComment(id));
        }
    }

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState('');

    const startEditing = (comment: CommentResponse) => {
        setEditingId(comment._id);
        setEditingText(comment.content);
    }

    const saveEditComment = async (id: string) => {
        try {
            await dispatch(updateComment({ id, content: editingText }));

            setEditingId(null);
            setEditingText('');

            if (post?._id) {
                dispatch(getPostById(post._id));
                dispatch(fetchComments(post._id));
            }
        } catch(err) {
            console.warn(err);
            alert('Ошибка при редактировании комментария');
        }
    }

    return (
        <SideBlock title="Комментарии">
            <List>
                {(isLoading ? [...Array(5)] : items).map((obj: CommentResponse, index) => (
                    <React.Fragment key={index}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                {isLoading ? (
                                    <Skeleton variant="circular" width={40} height={40} />
                                ) : (
                                    <Avatar alt={obj.user.login} src={`http://localhost:5000/${obj.user.avatarUrl}`} />
                                )}
                            </ListItemAvatar>
                            {isLoading ? (
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <Skeleton variant="text" height={25} width={120} />
                                    <Skeleton variant="text" height={18} width={230} />
                                </div>
                            ) : (
                                <>
                                    {editingId === obj._id ? (
                                        <div className="w-full">
                                            <TextField
                                                value={editingText}
                                                onChange={(e) => setEditingText(e.target.value)}
                                                fullWidth
                                                multiline
                                            />
                                            <div className="flex gap-2 mt-2">
                                                <Button onClick={() => saveEditComment(obj._id)} size="small" variant="contained">
                                                    Сохранить
                                                </Button>
                                                <Button size="small" variant="outlined" color="error" onClick={() => setEditingId(null)}>
                                                    Отмена
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <ListItemText
                                            primary={
                                                <Box display="flex" gap="8px" alignItems="center">
                                                    <Typography variant="subtitle1">{obj.user.login}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(obj.createdAt).toLocaleString()}
                                                    </Typography>
                                                </Box>
                                            }
                                            secondary={obj.content}
                                        />
                                    )}

                                    {(obj.user._id === data?.user.id || post?.user._id === data?.user.id) &&
                                        <div
                                            className="bg-white rounded-xl opacity-0 hover:opacity-100 transition-opacity flex space-x-2 p-2">
                                            {obj.user._id === data?.user.id &&
                                                <IconButton color="primary" size="small" aria-label="edit post">
                                                    <EditIcon onClick={() => startEditing(obj)} fontSize="small"/>
                                                </IconButton>
                                            }

                                            <IconButton color="secondary" size="small" aria-label="delete post">
                                                <DeleteIcon onClick={() => handleDelete(obj._id)} fontSize="small"/>
                                            </IconButton>
                                        </div>
                                    }
                                </>
                            )}
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </React.Fragment>
                ))}
            </List>
            {children}
        </SideBlock>
    );
};