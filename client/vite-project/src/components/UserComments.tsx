import React, {type ReactNode} from 'react';
import {SideBlock} from "./SideBlock.tsx";
import List from "@mui/material/List";
import type {CommentResponse} from "../models/CommentResponse.ts";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Skeleton from "@mui/material/Skeleton";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import {useNavigate} from "react-router-dom";

interface UserCommentsProps {
    items: CommentResponse[];
    children?: ReactNode;
    isLoading?: boolean;
}

const UserComments: React.FC<UserCommentsProps> = ({ items, isLoading, children}) => {
    const navigate = useNavigate();

    const handleClick = (postId: string) => {
        navigate(`/posts/${postId}`);
    }

    return (
        <SideBlock title="Ваши комментарии">
            <List sx={{
                maxHeight: 230,
                overflowY: 'auto',
                pr: 1
            }}>
                {(isLoading ? [...Array(5)] : items).map((obj: CommentResponse, index) => (
                    <React.Fragment key={index}>
                        <ListItem alignItems="flex-start" onClick={() => handleClick(obj.postId)} style={{ cursor: 'pointer'}}>
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
                                <ListItemText
                                        primary={obj.user.login}
                                        secondary={obj.content}
                                />
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

export default UserComments;