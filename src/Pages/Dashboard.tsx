import '../Css/general.css';
import '../Css/Dashboard.css';
import React, { useEffect } from 'react';
import { useAxiosJwt } from '../AxiosIntercept/useAxios';
import MyCard from '../Components/MyCard';
import Post from '../Components/Posts';
import PostModal from '../Components/PostModal';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import PostInfo from '../Types/PostInfo';
import Themed from '../Helpers/Themes';
import { Button } from 'react-bootstrap';
import { useTheme } from '../Context/MyThemeContext';
import { useGlobalContext } from '../Context/GlobalLoadingAndAlert';
import DropdownSearchResults from '../Components/DropdownSearchResults';
import { Tooltip } from 'react-tooltip';
import { Commet } from 'react-loading-indicators';

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
    const [width, setWidth] = React.useState<number>(window.innerWidth);
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
        if (id === -1) {
            setEditPost({ show: false, post: new PostInfo({}) });
            return;
        }
        axios.delete(`/deletepost`, {
            params: {
                postId: id
            }
        }).then((response) => {
            globalCtx.addAlert({ title: 'Post Deleted', text: 'Post has been deleted successfully.' });
            const newPosts = myPosts.filter((post) => {
                return post.id !== id;
            });
            if (newPosts.length === 0) {
                newPosts.push(new PostInfo({ title: 'No Posts', content: 'You have not post anything yet.', created_at: '', id: -1 }));
            }
            setPosts(newPosts);
        }).catch((error) => {
            if (error.response?.data?.message) {
                globalCtx.addAlert({ title: 'Post Could not be deleted', text: error.response.data.message });
                return;
            }
        });
        setEditPost({ show: false, post: new PostInfo({}) });

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
            setPosts([{ title: text, content: content, created_at: new Date().toUTCString(), id: id, user_id: myInfo?.id || 0, username: myInfo?.user || '' }, ...myPosts.filter((post) => post.id !== -1)]);
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
            axios.get('/posts?size=100').then((response) => {
                const { posts } = response.data;
                if (posts.length === 0) {
                    setPosts([new PostInfo({ title: 'No Posts', content: 'You have not post anything yet.', created_at: '', id: -1 })]);
                }
                else
                    setPosts(posts);

            }).catch((error) => {
                console.log(error);
            });
        }
        window.addEventListener('resize', () => {
            setWidth(window.innerWidth);
        }
        );
        return () => {
            window.removeEventListener('resize', () => {
                setWidth(window.innerWidth);
            });
        }
    }, [isAuthenticated]);
    return (
        <div className='outer-dashboard-div'>
            <div>
                <MyCard info={myInfo} setInfo={setMyInfo}></MyCard>
                <div>
                    <div className='d-flex flex-row align-content-center p-2 align-items-center'>
                        <div className='d-flex flex-column w-100'>
                            <DropdownSearchResults />
                        </div>
                        <div className='d-flex flex-row gap-2'>

                            <Button onClick={() => {
                                navigator('/globalfeed');
                            }}
                                data-tooltip-id='global-button-tooltip'
                                className={Themed("bt-globalfeed")} variant={theme === "light" ? "primary" : ""}
                                style={{ fontSize: '1.5em' }}
                            ><div className='bi bi-globe-americas'
                                style={{ fontSize: '1em' }}></div></Button>
                            <Button className={Themed("bt-post")} variant={theme === "light" ? "primary" : ""} onClick={() => setNewPost(true)}
                                style={{
                                    fontSize: width < 500 ? '1.5em' : '1em',
                                    height: width < 500 ? '' : '50px',

                                }}>
                                {width < 500 ? <div className='bi bi-plus-circle' /> :
                                    <div style={{ minWidth: '100px' }}>New Post</div>}
                            </Button>
                        </div>
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

                </div>

                <div style={{ maxHeight: '70vh', overflowY: 'scroll', overflowX: 'hidden', width: '100%' }} className='gap-1 d-flex flex-column align-content-center'>
                    {

                        myPosts.length == 0 ? <div style={{ width: "100%", display: "flex", justifyContent: "center" }}><Commet color={'orange'} /></div> :
                            myPosts.map((post, index) => {
                                return <Post key={index}
                                    post={post}
                                    onDelete={() => { handleDelete(post.id || 0) }} onClick={() => { if (post.id !== -1) showPostByIndex(index) }}
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
            <Tooltip className={"tooltip-custom"} id={"global-button-tooltip"}>Check what others are thinking</Tooltip>
        </div>
    );
};

export default Dashboard;