import React, { FC, useEffect, useMemo } from 'react';
import { useTheme } from '../Context/MyThemeContext';
import Themed from '../Helpers/Themes';
import { useAxiosJwt } from '../AxiosIntercept/useAxios';
import PostInfo from '../Types/PostInfo';
import { useGlobalContext } from '../Context/GlobalLoadingAndAlert';
import Post from '../Components/Posts/Posts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import GoBackButton from '../Components/GoBackButton';
const Globalfeed: FC = () => {
    const { theme } = useTheme();
    const [width, setWidth] = React.useState<number>(window.innerWidth);
    const axios = useAxiosJwt();
    const [posts, setPosts] = React.useState<PostInfo[]>([]);
    const globalCtx = useGlobalContext();
    const navigator = useNavigate();
    const { userId } = useAuth();
    const [querryNewInterval, setQuerryNewInterval] = React.useState<NodeJS.Timer | undefined>(undefined);
    const [firstLoad, setFirstLoad] = React.useState<boolean>(true);    
    const {isAuthenticated} = useAuth();
    useMemo (() => {
        if (querryNewInterval) {
            clearInterval(querryNewInterval);
        }
        const intervalId = setInterval(() => {
            const currentid = posts.length > 0 || !posts ? posts[0].id : 0;
            axios.get('newposts', {
                params: {
                    lastId: currentid,
                }
            }).then((response) => {
                let newPosts = posts;
                console.log(response.data?.posts.length, response.data?.deleted.length);
                if (response.data?.posts) {
                    newPosts = [...response.data.posts, ...posts];
                }
                if (response.data?.deleted) {
                    const delArray = response.data?.deleted;
                    newPosts = newPosts.filter((post) => {
                        return !delArray.includes(post.id);
                    });
                }
                setPosts(newPosts);
            }).catch((error) => {
                console.log(error);
            })}, 500);
        setQuerryNewInterval(intervalId);

        return () => {
            if (querryNewInterval) {
                clearInterval(querryNewInterval);
            }
        }
    }, [posts]);

    useEffect(() => {
        if (!isAuthenticated)
        {
            if (querryNewInterval) {
                clearInterval(querryNewInterval);
            }
            
            navigator('/login');
        }
        if (firstLoad) {
            axios.get('allposts', {
                params: {
                    size: 50,
                }
            }).then((response) => {
                setPosts(response.data.posts);
                console.log(response.data.posts);
            }).catch((error) => {
                console.log(error);
            }
            );
            setFirstLoad(false);
        }

      
        window.addEventListener('resize', () => {
            setWidth(window.innerWidth);
        });
        return () => {
            window.removeEventListener('resize', () => {
                setWidth(window.innerWidth);
            });
            if (querryNewInterval) {
                clearInterval(querryNewInterval);
            }
        }
    }, [isAuthenticated]);


    return (
        <div className='w-100'
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: '100%',
                marginTop: '5px;',
                overflowX: 'hidden',
                overflowY: 'hidden',
                boxShadow: '2px 2px 2px 2px rgba(0, 0, 0, 0.2)'
            }}>
            <div
                style={{
                    backgroundColor: theme === "dark" ? "#333" : "#aaa",
                    color: theme === "dark" ? "white" : "black",
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center',
                    padding: '10px',
                    marginBottom: '10px',
                }}
            >
                <GoBackButton />
                <h1 style={{ marginLeft: "2vw" }}>Global Feed</h1>
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                overflowX: 'hidden',
                overflowY: 'scroll',
                scrollbarWidth: 'none',
                height: '87vh',
                borderRadius: '5px',
                gap: '4px',
            }}>
                {posts.map((post) => {
                    return (
                        <Post key={post.id} post={post} onClick={() => {
                            if (querryNewInterval) {
                                clearInterval(querryNewInterval);
                            }
                             navigator('/users/' + post.user_id);
                        }} style={
                            {
                                width: '100%',
                            }

                        } />
                    );
                })
                }
            </div>
        </div>
    );
};

export default Globalfeed;