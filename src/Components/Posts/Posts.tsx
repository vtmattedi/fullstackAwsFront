import React from 'react';
import "./Posts.css";

interface PostProps {
    title: string;
    text: string;
    onDelete: () => void;
}

const Post: React.FC<PostProps> = ({ title, text, onDelete }) => {
    return (
        <div className='posts-outer-div'>
            <div className='posts-title-button-div'>
                <h2 className='posts-title'>{title}</h2>
                <button className='posts-button' onClick={onDelete}>Delete</button>
            </div>
            <p className='posts-text'>{text.repeat(20)}</p>
        </div>
    );
};

export default Post;