import React from 'react';
import noAvatar from '../assets/noavatar.png'
import {useNavigate} from "react-router-dom";

interface UserInfoProps {
    _id: string;
    avatarUrl?: string;
    login: string;
    additionalText: string;
}

export const UserInfo: React.FC<UserInfoProps> = ({_id, avatarUrl, login, additionalText}) => {
    let fullUrl = '';
    if (avatarUrl) {
        fullUrl = `http://localhost:5000/${avatarUrl}`;
    }

    const navigate = useNavigate();
    const clickProfile = () => {
        navigate(`/profile/${_id}`);
    }

    return(
        <div onClick={clickProfile} className='flex items-center cursor-pointer'>
            <img className='w-7.5 h-7.5 rounded-full mr-2.5' src={fullUrl || noAvatar} alt={login}/>
            <div className='flex flex-col'>
                <span className='font-medium text-sm'>{login}</span>
                <span className='text-xs opacity-60'>{additionalText}</span>
            </div>
        </div>
    );
}