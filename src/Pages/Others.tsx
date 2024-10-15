import React, { useEffect } from 'react';
import { useAxiosJwt } from '../AxiosIntercept/useAxios';
import Post from '../Components/Posts/Posts';
import { useAuth } from '../Context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import '../common.css';
import PostInfo from '../Types/PostInfo';
import './Dashboard.css';
import { Button } from 'react-bootstrap';
import { useTheme } from '../Context/MyThemeContext';
import DropdownSearchResults from '../Components/DropdownSearchResults';
import OthersCard from '../Components/OthersCard';
import Skeleton from 'react-loading-skeleton';

const Others: React.FC = () => {
    const axios = useAxiosJwt();
    const [userInfo, setUserInfo] = React.useState<{ user: string, email: string, id: number } | undefined>(undefined);
    const [myPosts, setPosts] = React.useState<PostInfo[]>([]);
    const [newPost, setNewPost] = React.useState<boolean>(false);
    const [newInterval, setNewInterval] = React.useState<number | undefined>(undefined);
    const [editPost, setEditPost] = React.useState<{ show: boolean, post: PostInfo }>({ show: false, post: new PostInfo({ title: '', content: '', created_at: '', id: 0, user_id: 0 }) });
    const navigator = useNavigate();
    const { theme } = useTheme();
    const location = useLocation();
    const {userId} = useAuth();



    const showPostByIndex = (index: number) => {
        if (index < myPosts.length) {
            const post = myPosts[index];
            setEditPost({ show: true, post: post });
        }

    }



    useEffect(() => {
        const uid = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);

        if (uid == userId)
            navigator('/dashboard');
        axios.get('/userinfo/' + uid).then((response) => {
            setUserInfo(response.data);
            axios.get('/posts/' + uid).then((response) => {
                const { posts } = response.data;
                if (posts.length === 0) {
                    setPosts([new PostInfo({ title: 'No Posts', content: 'This user have not post anything yet.', created_at: '', id: 0 })]);
                }
                else
                    setPosts(posts);
            }).catch((error) => {
                console.log(error);
            });
        }).catch(() => {
            navigator('/404');
        });


    }, [location]);

    return (
        <div className='outer-dashboard-div'>
            <div >
                <OthersCard info={userInfo}></OthersCard>
                <div>
                    <div className='d-flex flex-row align-content-center'>
                        <div className='d-flex flex-column w-100'>
                            <DropdownSearchResults />
                        </div>
                    </div>
                </div>

                <div>
                    <h1>Posts</h1>
                </div>

                <div style={{ maxHeight: '50vh', overflowY: 'scroll', overflowX: 'hidden' }} className='gap-1 d-flex flex-column align-content-center'>
                    {
                            myPosts.map((post, index) => {
                                return <Post key={index}
                                    post={post}
                                    onDelete={() => { }} onClick={() => { showPostByIndex(index) }}
                                />
                            })
                    }
                </div>


            </div>
        </div>
    );
};

export default Others;