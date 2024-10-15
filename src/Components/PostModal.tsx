import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import './PostModal.css';
import { useTheme } from '../Context/MyThemeContext';
import PostInfo from '../Types/PostInfo';
import calc_time from '../Helpers/Time';
import Themed from '../Helpers/Themes';
interface PostModalProps {
    show?: boolean;
    handleClose?: () => void;
    post?: PostInfo;
    onPost?: (title: string, content: string, id?: number) => void;
    edit?: boolean;
    onDelete?: () => void;
}

const PostModal: React.FC<PostModalProps> = ({ show, handleClose, post, onPost, edit, onDelete }) => {
    const { theme, toggleTheme } = useTheme();
    const [title, setTitle] = React.useState("");
    const [content, setContent] = React.useState("");

    const Post = () => {
        if (edit) {
            if (onPost) {
                onPost(title, content, post?.id);
            }
        }
        else {
            onPost?.(title, content);
        }
        setTitle("");
        setContent("");
    }


    React.useEffect(() => {
        if (post) {
            setTitle(post.title || "");
            setContent(post.content || "");
        }
    }, [post]);

    return (
        <Modal show={show} centered data-bs-theme={theme}>
            <Modal.Header>

                <Modal.Title className='w-100'>
                    <p className={Themed("new-post-info")}> {edit ? "Edit Post" : "New Post"}</p>
                    <input className={Themed("new-post-title")} type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />

                </Modal.Title>
                <p className={Themed('post-modal-created-at')}>{calc_time(post?.created_at)}</p>

            </Modal.Header>
            <Modal.Body>
                <textarea className={Themed("new-post-input")} placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} />
            </Modal.Body>
            <Modal.Footer>
                {
                    edit &&

                    <div>
                <Button variant="danger" onClick={onDelete}
                    style={{
                        fontWeight: 'bold',
                    }}>
                    Delete Post
                </Button>
                </div>
                }

                <Button variant="danger" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={Post}
                    disabled={title.length === 0 || content.length === 0}
                    style={{
                        fontWeight: 'bold',
                        minWidth: '100px'
                    }}>
                    {edit ? "Edit" : "Post"}
                </Button>
            
                {/* <Button variant="primary" onClick={() => { toggleTheme("1000") }}
                    style={{
                        fontWeight: 'bold',
                        minWidth: '100px'
                    }}>
                    toggleTheme
                </Button> */}
            </Modal.Footer>
        </Modal>
    );
};

export default PostModal;