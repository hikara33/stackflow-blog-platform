import React, {useEffect} from 'react'
import {useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../redux/store.ts";
import {getPostsByTag, type IPost} from "../redux/slices/posts-slice.ts";
import {PostSkeleton} from "../components/Post/Skeleton.tsx";
import {Post, SideBlock} from "../components";


const PostsByTag: React.FC = () => {
    const params = useParams();

    const { posts } = useAppSelector(state => state.posts);
    console.log(posts.items);
    const isPostsLoading = posts.status === 'loading';
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (params.tagId) {
            dispatch(getPostsByTag(params.tagId));
        }
    }, [params.tagId]);

    return (
        <>
            <SideBlock title={`Посты по тегу #${params.tagId}`}>
                <div className='mt-5'>
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
                                commentsCount={3}
                                tags={obj.tags}
                                isEditable
                            />
                        )
                    )}
                </div>
            </SideBlock>
        </>
    );
};

export default PostsByTag;