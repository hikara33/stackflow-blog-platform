import React, {type ChangeEvent, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import {Link, useNavigate, useParams} from "react-router-dom";

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import $api from "../../http";
import {PostsService} from "../../services/PostsService.ts";
import type {IPost} from "../../redux/slices/posts-slice.ts";

export const AddPost: React.FC = () => {
    const [text, setText] = useState('');
    const [title, setTitle] = useState('');
    const [tags, setTags] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
        }
    }, []);

    const { id } = useParams();
    const isEditing = Boolean(id);

    useEffect(() => {
        if (id) {
            $api.get<IPost>(`/posts/${id}`)
                .then(({ data }) => {
                    setTitle(data.title);
                    setText(data.text);
                    setTags(data.tags?.join(' ') || '');
                    setImageUrl(data.imageUrl || '');
                })
        }
    }, []);

    const handleClickFile = () => {
        inputRef.current?.click();
    }

    const handleChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0];

            if (!file) return;

            const formData = new FormData();
            formData.append('image', file);
            const { data } = await $api.post('/upload', formData);

            setImageUrl(data.url)
        } catch(err) {
            console.warn(err);
            alert('Ошибка при загрузке')
        }
    }

    const onClickRemoveImage = () => {
        setImageUrl('');
    };

    const onChange = useCallback((value: string) => {
        setText(value);
    }, []);

    const createPost = async () => {
        try {
            const normalizedTags = tags
                .split(' ')
                .map(t => t.trim())
                .filter(Boolean);

            const fields = {
                title,
                text,
                tags: normalizedTags,
                imageUrl,
            };
            const { data } = id ? await PostsService.patchPost(fields, id) : await PostsService.createPost(fields);

            const _id = data._id;
            navigate(`/posts/${_id}`);
        } catch(err) {
            console.warn(err);
            alert('Ошибка при создании поста');
        }
    };

    const options = useMemo(
        () => ({
            spellChecker: false,
            maxHeight: '400px',
            autofocus: true,
            placeholder: 'Введите текст...',
            status: false,
            autosave: {
                enabled: true,
                uniqueId: 'add-post-textarea',
                delay: 1000,
            }
        }),
        [],
    );

    return(
        <Paper className='p-[30px]'>
            <Button onClick={handleClickFile} variant="outlined" size="large">Загрузить превью</Button>
            <input ref={inputRef} type="file" onChange={handleChangeFile} hidden />
            {imageUrl && (
                <>
                    <Button variant="contained" color="error" onClick={onClickRemoveImage} style={{ marginLeft: '10px' }}>
                        Удалить
                    </Button>
                    <img className='w-full mt-5' src={`http://localhost:5000${imageUrl}`} alt="Uploaded" />
                </>
            )}
            <br />
            <br />
            <TextField
                value={title}
                onChange={e => setTitle(e.target.value)}
                classes={{ root: styles.title }}
                variant="standard"
                placeholder="Заголовок статьи..."
                fullWidth
            />
            <TextField
                value={tags}
                onChange={e => setTags(e.target.value)}
                className='my-4' variant="standard" placeholder="Тэги" fullWidth />
            <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
            <div className='flex'>
                <Button onClick={createPost} className='mr-4' size="large" variant="contained">
                    {isEditing ? 'Сохранить' : 'Опубликовать'}
                </Button>
                <Link to="/">
                    <Button className='mr-4' size="large">Отмена</Button>
                </Link>
            </div>
        </Paper>
    );
};