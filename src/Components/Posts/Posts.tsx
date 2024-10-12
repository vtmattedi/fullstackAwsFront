import React from 'react';
import "./Posts.css";
import PostInfo from '../../Types/PostInfo';
import { Card } from 'react-bootstrap';
import { useTheme } from '../../Context/MyThemeContext';
import calc_time from '../../Helpers/Time';

interface PostProps {
    post: PostInfo;
    onDelete: () => void;
    onClick?: () => void;
}

const Post: React.FC<PostProps> = ({ post, onDelete, onClick }) => {
    const { theme } = useTheme();
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Card className="w-50 border" onClick={onClick} data-bs-theme={theme} >
                <Card.Body>
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Text>{post.content}</Card.Text>
                    <Card.Text style={{fontSize: '0.7em'}}>{calc_time(post.created_at)}</Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Post;