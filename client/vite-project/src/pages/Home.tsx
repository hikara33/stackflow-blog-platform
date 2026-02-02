import React, {useEffect} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import { Post } from '../components';
import { TagsBlock } from '../components';
import {PostSkeleton} from "../components/Post/Skeleton.tsx";

import {getPopularTags, type IPost} from '../redux/slices/posts-slice.ts';
import {fetchPosts} from "../redux/slices/posts-slice.ts";
import {useAppDispatch, useAppSelector} from "../redux/store.ts";
import {getUserComments} from "../redux/slices/comments-slice.ts";
import UserComments from "../components/UserComments.tsx";

export const Home: React.FC = () => {
    const dispatch = useAppDispatch();
    const { posts, tags } = useAppSelector(state => state.posts);
    const { data, isAuth } = useAppSelector(state => state.auth);
    const { userComments } = useAppSelector(state => state.comments);
    const isPostsLoading = posts.status === 'loading';
    const isTagsLoading = tags.status === 'loading';

    useEffect(() => {
        dispatch(fetchPosts());
        dispatch(getPopularTags());
        dispatch(getUserComments());
    }, []);

    return (
        <>
            <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
                <Tab label="Новые" />
                <Tab label="Популярные" />
            </Tabs>

            <Box
                sx={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        md: "2fr 1fr"
                    },
                    gap: 4,
                }}
            >
                <Box>
                    {(isPostsLoading ? [...Array(5)] : posts.items).map((obj: IPost, index) =>
                        isPostsLoading ? (
                            <PostSkeleton/>
                        ) : (
                            <Post
                                key={index}
                                _id={obj._id}
                                title={obj.title}
                                imageUrl={obj.imageUrl}
                                user={obj.user}
                                createdAt={obj.createdAt}
                                viewsCount={obj.views}
                                commentsCount={obj.commentsCount}
                                tags={obj.tags}
                                isEditable={obj.user?._id === data?.user.id}
                            />
                        )
                    )}
                </Box>

                <Box>
                    <TagsBlock items={tags.items} isLoading={isTagsLoading} />
                    {isAuth &&
                        <UserComments
                            items={userComments.items}
                            isLoading={false}
                        />
                    }
                </Box>
            </Box>
        </>
    );
};