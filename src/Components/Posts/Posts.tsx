import React from 'react';
import "./Posts.css";
import PostInfo from '../../Types/PostInfo';

interface PostProps {
    title: string;
    text: string;
    onDelete: () => void;
    onClick?: () => void;
}

const Post: React.FC<PostProps> = ({ title, text, onDelete, onClick }) => {
    return (
        <div >
       <div>{title}</div>
       <div>{text}</div>
       </div>
    );
};

export default Post;