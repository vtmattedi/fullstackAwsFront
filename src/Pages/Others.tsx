import '../Css/general.css';
import '../Css/Dashboard.css';

import React, { useEffect } from 'react';
import { useAxiosJwt } from '../AxiosIntercept/useAxios';
import Post from '../Components/Posts/Posts';
import { useAuth } from '../Context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import PostInfo from '../Types/PostInfo';
import DropdownSearchResults from '../Components/DropdownSearchResults';
import OthersCard from '../Components/OthersCard';
import { Commet } from 'react-loading-indicators';

const Others: React.FC = () => {
    const axios = useAxiosJwt();
    const [userInfo, setUserInfo] = React.useState<{ user: string, email: string, id: number } | undefined>(undefined);
    const [myPosts, setPosts] = React.useState<PostInfo[]>([]);
    const navigator = useNavigate();
    const location = useLocation();
    const { userId } = useAuth();

    useEffect(() => {
        const uid = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);

        if (uid == userId)
            navigator('/dashboard');
        setUserInfo(undefined);
        axios.get('/userinfo/' + uid).then((response) => {
            setUserInfo(response.data);
            axios.get('/posts/' + uid,{
                params:{
                    size : 50
                }
            }).then((response) => {
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

                <div style={{alignContent: "center", justifyContent:"center", width:"100%", display: "flex"}}>
                    <h1>Posts</h1>
                </div>
                <hr/>

                <div style={{ maxHeight: '70vh', overflowY: 'scroll', overflowX: 'hidden' }} className='gap-1 d-flex flex-column align-content-center'>
                    {

                        myPosts.length == 0 ? <div style={{width:"100%", display:"flex", justifyContent:"center"}}><Commet color={'orange'}/></div> :  
                        myPosts.map((post, index) => {
                            return <Post key={index}
                                post={post}
                            />
                        })
                    }
                </div>


            </div>
        </div>
    );
};

export default Others;