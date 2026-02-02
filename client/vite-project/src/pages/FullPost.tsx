import React, {useEffect} from 'react';

import {Post} from "../components";
import {AddComment} from '../components';
import {CommentsBlock} from "../components";
import {useAppDispatch, useAppSelector} from "../redux/store.ts";
import {useParams} from "react-router-dom";
import {getPostById} from "../redux/slices/posts-slice.ts";
import ReactMarkdown from "react-markdown";
import {fetchComments} from "../redux/slices/comments-slice.ts";
import $api from "../http";

export const FullPost: React.FC = () => {
    const { id } = useParams();

    const dispatch = useAppDispatch();
    const { isAuth } = useAppSelector(state => state.auth);
    const { currentPost } = useAppSelector(state => state.posts);
    const { comments } = useAppSelector(state => state.comments);
    const isCommentsLoading = comments.status === 'loading';

    useEffect(() => {
        if (!id) return;

        const viewed = JSON.parse(localStorage.getItem('viewedPosts') || '[]');

        if (!viewed.includes(id)) {
            $api.patch(`/posts/${id}/views`);

            viewed.push(id);
            localStorage.setItem('viewedPosts', JSON.stringify(viewed));
        }

        dispatch(getPostById(id));
        dispatch(fetchComments(id));
    }, [id]);

    return (
        <>
            {currentPost.item && <Post
                _id={currentPost.item._id}
                title={currentPost.item.title}
                imageUrl={currentPost.item.imageUrl}
                user={currentPost.item.user}
                createdAt={currentPost.item.createdAt}
                viewsCount={currentPost.item.views}
                commentsCount={currentPost.item.commentsCount}
                tags={currentPost.item.tags}
                isFullPost
            >
                <ReactMarkdown children={currentPost.item.text}/>
            </Post>}
            <CommentsBlock
                items={comments.items}
                post={currentPost.item}
                isLoading={isCommentsLoading}
            >
                {isAuth
                    ? <AddComment postId={id}/>
                    : <div className="text-xl text-center text-blue-700 mt-2">Авторизуйтесь, чтоб поделиться своим мнением!</div>}
            </CommentsBlock>
        </>
    );
};