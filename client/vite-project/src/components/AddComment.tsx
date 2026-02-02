import React, {useState} from "react";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import {useAppDispatch, useAppSelector} from "../redux/store.ts";
import {createComment, fetchComments} from "../redux/slices/comments-slice.ts";
import noAvatar from '../assets/noavatar.png';
import {getPostById} from "../redux/slices/posts-slice.ts";

interface AddCommentProps {
    postId?: string,
}

export const AddComment: React.FC<AddCommentProps> = ({postId}) => {
    const [content, setContent] = useState('');
    const dispatch = useAppDispatch();
    const { data } = useAppSelector(state => state.auth);

    const addCommentClick = async () => {
        try {
            if (postId && content.trim()) {
                await dispatch(createComment({ postId, content })).unwrap();
                await dispatch(getPostById(postId));
                await dispatch(fetchComments(postId));

                setContent('');
            }
        } catch(err) {
            console.warn(err);
            alert('Ошибка при добавлении комментария')
        }
    }

    return (
        <>
            <div className='flex mt-2.5 pb-5 mr-5 ml-[17px]'>
                <Avatar className='mr-3.5' src={data?.user.avatarUrl
                    ? `http://localhost:5000/${data.user.avatarUrl}`
                    : noAvatar}/>
                <div className='w-full'>
                    <TextField
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        label='Оставьте комментарий'
                        variant="outlined"
                        maxRows={10}
                        multiline
                        fullWidth
                    />
                    <Button onClick={addCommentClick}
                            disabled={!content.trim()}
                            variant='contained' sx={{marginTop: 1.5}}>Отправить</Button>
                </div>
            </div>
        </>
    );
};