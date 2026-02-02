import React from "react";
import {SideBlock} from "./SideBlock.tsx";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import { Link } from "react-router-dom";
import type {ITags} from "../models/PostResponse.ts";

interface TagsBlockProps {
    items: ITags[]
    isLoading: boolean;
}

export const TagsBlock: React.FC<TagsBlockProps> = ({ items, isLoading = true }) => {
    const skeletonLength = items.length === 5 ? 5 : items.length;

    return (
        <SideBlock title="Тэги">
            <List>
                {(isLoading ? [...Array(skeletonLength)] : items).map((name: ITags, index) => (
                    <Link
                        style={{ textDecoration: "none", color: "black" }}
                        to={`/tags/${name._id}`}
                    >
                        <ListItem key={index} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>
                                    <TagIcon />
                                </ListItemIcon>
                                {isLoading ? (
                                    <Skeleton width={100} />
                                ) : (
                                    <ListItemText primary={name._id} />
                                )}
                            </ListItemButton>
                        </ListItem>
                    </Link>
                ))}
            </List>
        </SideBlock>
    );
};