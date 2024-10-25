import "../Css/Posts.css";
import React, { useEffect } from 'react';
import PostInfo from '../Types/PostInfo';
import { Card } from 'react-bootstrap';
import { useTheme } from '../Context/MyThemeContext';
import calc_time from '../Helpers/Time';

interface PostProps {
    post: PostInfo;
    onDelete?: () => void;
    onClick?: () => void;
    style?: React.CSSProperties;
}

const Post: React.FC<PostProps> = ({ post, onDelete, onClick, style }) => {
    const { theme } = useTheme();
    const [width, setWidth] = React.useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...style
        }}>
            <Card className="border" onClick={onClick} data-bs-theme={theme} style={
                {
                    width: width < 400 ? '100%' : '75%',
                    maxWidth: '800px',
                    minWidth: '375px'
                }}>
                    <Card.Header>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: `100%`}}>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Text style={{ fontSize: '0.7em', color: 'darkgray' }}>{post.username}</Card.Text>
                    </div>
                </Card.Header>
                <Card.Body>
                
                    <Card.Text>{post.content}</Card.Text>
                    <div style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'right',
                            justifyItems: 'right',
                            width: `100%`,
                        }}>
                           <div></div> 
                        <Card.Text  style={{ fontSize: '0.7em' }}>{calc_time(post.created_at)}</Card.Text>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Post;