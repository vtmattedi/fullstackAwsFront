import React, { useEffect } from 'react';
import { useAxiosJwt } from '../AxiosIntercept/useAxios';
import MyCard from '../Components/MyCard';
import Post from '../Components/Posts/Posts';
import UserCard from '../Components/UserCards';
import PostModal from '../Components/PostModal';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../common.css';
import Skeleton from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css";
import PostInfo from '../Types/PostInfo';
import Themed from '../Helpers/Themes';
import './Dashboard.css';
import { Button } from 'react-bootstrap';
import { useTheme } from '../Context/MyThemeContext';
import { useGlobalContext } from '../Context/GlobalLoadingAndAlert';
import DropdownSearchResults from '../Components/DropdownSearchResults';

const Dashboard: React.FC = () => {
    const axios = useAxiosJwt();
    const { setUserId } = useAuth();
    const [myInfo, setMyInfo] = React.useState<{ user: string, email: string, id: number } | undefined>(undefined);
    const [myPosts, setPosts] = React.useState<PostInfo[]>([]);
    const [newPost, setNewPost] = React.useState<boolean>(false);
    const { isAuthenticated } = useAuth();
    const [editPost, setEditPost] = React.useState<{ show: boolean, post: PostInfo }>({ show: false, post: new PostInfo({ title: '', content: '', created_at: '', id: 0, user_id: 0 }) });
    const navigator = useNavigate();
    const { theme } = useTheme();
    const globalCtx = useGlobalContext();

    const updateData = async () => {
        axios.get('/dashboard').then((response) => {
            setMyInfo(response.data);
            setUserId(response.data.id);

        }).catch((error) => {
            console.log(error);
        });
    }


    const handleDelete = (id: number) => {
        setEditPost({ show: false, post: new PostInfo({}) });
        axios.delete(`/deletepost`, {
            params: {
                postId: id
            }
        }).then((response) => {
            globalCtx.addAlert({ title: 'Post Deleted', text: 'Post has been deleted successfully.' });
            const newPosts = myPosts.filter((post) => {
                return post.id !== id;
            });
            setPosts(newPosts);
        }).catch((error) => {
            if (error.response?.data?.message) {
                globalCtx.addAlert({ title: 'Post Could not be deleted', text: error.response.data.message });
                return;
            }
        });
    }


    const showPostByIndex = (index: number) => {
        if (index < myPosts.length) {
            const post = myPosts[index];
            setEditPost({ show: true, post: post });
        }

    }

    const createPost = (text: string, content: string) => {
        axios.post('/newPost', {
            title: text,
            content: content
        }).then((response) => {
            const { message, id } = response.data;
            setPosts([{ title: text, content: content, created_at: new Date().toUTCString(), id: id, user_id: myInfo?.id || 0, username: myInfo?.user || '' }, ...myPosts]);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        });
        setNewPost(false);

    }

    const handleEditPost = (text: string, content: string, id: Number) => {
        axios.put(`/editpost`, {
            
                postId: id,
                title: text,
                content: content
            
        }).then((response) => {
            const { message } = response.data;
            console.log(message);
            const newPosts = myPosts.map((post) => {
                if (post.id === id) {
                    post.title = text;
                    post.content = content;
                }
                return post;
            });
            setPosts(newPosts);
        }).catch((error) => {
            console.log(error);
        });
        setEditPost({ show: false, post: new PostInfo({}) });
    }

    useEffect(() => {
        if (!isAuthenticated) {
            navigator('/');
        }
        else {
            updateData();
            axios.get('/posts').then((response) => {
                const { posts } = response.data;
                if (posts.length === 0) {
                    setPosts([new PostInfo({ title: 'No Posts', content: 'You have not post anything yet.', created_at: '', id: 0 })]);
                }
                else
                    setPosts(posts);

            }).catch((error) => {
                console.log(error);
            });
        }
    }, [isAuthenticated]);
    return (
        <div className='outer-dashboard-div'>
            <div>
                <MyCard info={myInfo} setInfo={setMyInfo}></MyCard>
                <div>
                    <div className='d-flex flex-row align-content-center'>
                        <div className='d-flex flex-column w-100'>
                            <DropdownSearchResults />
                        </div>
                        <Button className={Themed("bt-post")} variant={theme === "light" ? "primary" : ""} onClick={() => setNewPost(true)}>
                            New Post
                        </Button>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    padding: '0 10px',
                    borderBottom: '2px solid black',
                    marginBottom: '10px',

                    alignSelf: 'center'

                }}>
                    <Button onClick={() => {
                        navigator('/globalfeed');
                    }}
                        variant='outline-primary'
                    >Global Feed</Button>
                    <h1>My Posts</h1>

                </div>

                <div style={{ maxHeight: '50vh', overflowY: 'scroll', overflowX: 'hidden' }} className='gap-1 d-flex flex-column align-content-center'>
                    {
                        myPosts.length === 0 ? <Skeleton count={1} /> :
                            myPosts.map((post, index) => {
                                return <Post key={index}
                                    post={post}
                                    onDelete={() => { handleDelete(post.id || 0) }} onClick={() => { showPostByIndex(index) }}
                                />
                            })
                    }
                </div>
                <PostModal show={newPost} handleClose={() => { setNewPost(false) }} onPost={createPost} />
                <PostModal show={editPost.show} handleClose={() => { setEditPost({ show: false, post: new PostInfo({}) }) }}
                    onPost={(title, content, id) => {
                        handleEditPost(title, content, id || -1);
                    }} post={editPost.post}
                    onDelete={() => { handleDelete(editPost.post.id || -1) }}
                    edit={true} />

            </div>
        </div>
    );
};

export default Dashboard;