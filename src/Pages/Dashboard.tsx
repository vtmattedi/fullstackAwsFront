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

const Dashboard: React.FC = () => {
    const axios = useAxiosJwt();
    const { setUserId } = useAuth();
    const [data, setData] = React.useState<string>("");
    const [disableRefresh, setDisableRefresh] = React.useState(false);
    const [myInfo, setMyInfo] = React.useState<{ user: string, email: string, id: number } | undefined>(undefined);
    const [myPosts, setPosts] = React.useState<PostInfo[]>([]);
    const [searchUser, setSearchUser] = React.useState<string>("");
    const [searchResult, setSearchResult] = React.useState<Array<{ user: string, email: string, id: number, created_at: string }>>([]);
    const [searchHandler, setSearchHandler] = React.useState<ReturnType<typeof setTimeout>>();
    const [newPost, setNewPost] = React.useState<boolean>(false);
    const { isAuthenticated } = useAuth();
    const [editPost, setEditPost] = React.useState<{ show: boolean, post: PostInfo }>({ show: false, post: new PostInfo({ title: '', content: '', created_at: '', postid: 0, user_id: 0 }) });
    const navigator = useNavigate();
    const updateData = async () => {
        setDisableRefresh(true);
        axios.get('/dashboard').then((response) => {
            setMyInfo(response.data);
            setUserId(response.data.id);

        }).catch((error) => {
            console.log(error);
        }
        ).finally(() => {
            setDisableRefresh(false);
        });
    }


    const handleDelete = (id: number) => {
        axios.delete(`/post/${id}`).then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }

    const searchForUser = (username: string) => {
        axios.get(`/finduser/${username}`).then((response) => {
            console.log(response.data);
            setSearchResult(response.data?.users);
        }).catch((error) => {
            console.log(error);
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
            const { message, postid } = response.data;
            setPosts([...myPosts, { title: text, content: content, created_at: new Date().toDateString(), postid: postid, user_id: myInfo?.id || 0 }]);
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        });
        setNewPost(false);

    }

    useEffect(() => {
        if (!isAuthenticated) {
            navigator('/login');
        }
        updateData();
        axios.get('/posts').then((response) => {
            const { posts } = response.data;
            if (posts.length === 0) {
                setPosts([new PostInfo({ title: 'No Posts', content: 'No Posts', created_at: '', postid: 0 })]);
            }
            else
                setPosts(posts);
        }).catch((error) => {
            console.log(error);
        });
    }, []);
    return (
        <div className='outer-dashboard-div'>
            <div >
                <MyCard info={myInfo} setInfo={setMyInfo}></MyCard>
                <div onMouseLeave={
                    () => {
                        if (searchHandler) {
                            clearTimeout(searchHandler);
                        }
                        setSearchResult([]);
                    }
                }
                >
                    <div className='d-flex flex-row align-content-center'>
                        <div className='d-flex flex-column w-100'>
                            <div className={Themed("input-search-div")}>
                                <input type='text' placeholder='Search an User' onChange={(e) => {
                                    setSearchUser(e.target.value);
                                    if (searchHandler) {
                                        clearTimeout(searchHandler);
                                    }
                                    setSearchHandler(setTimeout(() => { searchForUser(e.target.value) }, 200));
                                }}
                                    onMouseEnter={
                                        () => {
                                            console.log('mouse enter');
                                            if (searchUser.length > 0) {
                                                if (searchHandler) {
                                                    clearTimeout(searchHandler);
                                                }
                                                setSearchHandler(setTimeout(() => { searchForUser(searchUser) }, 200));
                                            }
                                        }
                                    }
                                />
                            </div>
                        </div>
                        <Button className={Themed("bt-post")} onClick={() => setNewPost(true)}>
                            New Post
                        </Button>
                    </div>
                    <div style={{ maxHeight: '50vh', overflowY: 'scroll', overflowX: 'hidden' }}>
                        {
                            searchResult.map((post, index) => {
                                return <UserCard key={index} username={post.user} mail={post.email} created_at={post.created_at} onClick={() => { console.log(post.id) }} />
                            })
                        }
                    </div>
                </div>

                <div>
                    <h1>My Posts</h1>
                </div>

                <div style={{ maxHeight: '50vh', overflowY: 'scroll', overflowX: 'hidden' }} className='gap-1 d-flex flex-column align-content-center'>
                    {
                        myPosts.length === 0 ? <Skeleton count={1} /> :
                            myPosts.map((post, index) => {
                                return <Post key={index}
                                    post={post}
                                    onDelete={() => { handleDelete(post.postid || 0) }} onClick={() => { showPostByIndex(index) }}
                                />
                            })
                    }
                </div>


                <PostModal show={newPost} handleClose={() => { setNewPost(false) }} onPost={createPost} />
                <PostModal show={editPost.show} handleClose={() => { setEditPost({ show: false, post: new PostInfo({}) }) }}
                    onPost={(title, content, postid) => {
                        console.log(title, content, postid);
                        setEditPost({ show: false, post: new PostInfo({}) });
                    }} post={editPost.post} edit={true} />

            </div>
        </div>
    );
};

export default Dashboard;