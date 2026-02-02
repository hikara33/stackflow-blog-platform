import React from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import EyeIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import clsx from "clsx";
import {UserInfo} from "../UserInfo";
import {Link, useNavigate} from "react-router-dom";

import {type IUserDto, removePost} from "../../redux/slices/posts-slice.ts";
import {formatDate} from "date-fns";
import {useAppDispatch} from "../../redux/store.ts";

interface PostProps {
    _id: string,
    title: string,
    createdAt: string,
    imageUrl?: string,
    user: IUserDto,
    viewsCount: number,
    commentsCount: number,
    tags?: string[],
    children?: React.ReactNode,
    isFullPost?: boolean,
    isEditable?: boolean,
    id?: number
}

export const Post: React.FC<PostProps> = ({
                                              _id,
                                              title,
                                              createdAt,
                                              imageUrl,
                                              user,
                                              viewsCount,
                                              commentsCount,
                                              tags,
                                              children,
                                              isFullPost = false,
                                              isEditable
                                          }) => {

    const formattedDate = formatDate(new Date(createdAt), 'dd.MM.yyyy HH:mm');

    const dispatch = useAppDispatch();

    const onClickRemove = () => {
        if (window.confirm('Вы точно хотите удалить пост?')) {
            dispatch(removePost(_id));
        }
    };

    const navigate = useNavigate();
    const onClickTag = (tagId: string) => {
        navigate(`/tags/${tagId}`);
    };

    return (
        <div
            className={clsx(
                "bg-white border border-gray-300 rounded-md overflow-hidden mb-4 relative",
                {"hover:border-blue-600 hover:shadow-md": !isFullPost}
            )}
        >
            {isEditable && (
                <div
                    className="absolute right-4 top-4 bg-white rounded-xl opacity-0 hover:opacity-100 transition-opacity flex space-x-2 p-2">
                    <Link to={`/posts/${_id}/edit`} className="text-blue-600 hover:text-blue-900">
                        <IconButton color="primary" size="small" aria-label="edit post">
                            <EditIcon fontSize="small"/>
                        </IconButton>
                    </Link>
                    <IconButton onClick={onClickRemove} color="secondary" size="small" aria-label="delete post">
                        <DeleteIcon fontSize="small"/>
                    </IconButton>
                </div>
            )}
            {imageUrl && (
                <img
                    className={clsx(
                        "w-full object-cover",
                        {"min-h-[300px] h-auto": isFullPost, "h-[300px]": !isFullPost}
                    )}
                    src={`http://localhost:5000${imageUrl}`}
                    alt={title}
                />
            )}
            <div className="p-4">
                <UserInfo {...user} additionalText={formattedDate}/>
                <div className="pl-10">
                    <h2 className={clsx("text-black mb-2", {
                        "text-4xl font-extrabold": isFullPost,
                        "text-2xl": !isFullPost
                    })}>
                        {isFullPost ? (
                            title
                        ) : (
                            <Link to={`/posts/${_id}`} className="hover:text-blue-700">
                                {title}
                            </Link>
                        )}
                    </h2>
                    <ul className="flex flex-wrap mb-4">
                        {tags?.map((name) => (
                            <li onClick={() => onClickTag(name)} key={name} className="mr-4 text-gray-600 hover:text-black cursor-pointer">
                                #{name}
                            </li>
                        ))}
                    </ul>
                    {children && <div className="mb-12">{children}</div>}
                    <ul className="flex space-x-6 text-gray-500 text-sm">
                        <li className="flex items-center space-x-1">
                            <EyeIcon fontSize="small"/>
                            <span>{viewsCount}</span>
                        </li>
                        <li className="flex items-center space-x-1">
                            <CommentIcon fontSize="small"/>
                            <span>{commentsCount}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
