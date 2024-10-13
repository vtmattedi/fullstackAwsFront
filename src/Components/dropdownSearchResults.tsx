import React from 'react';
import { Collapse } from 'react-bootstrap';
import { useTheme } from '../Context/MyThemeContext';
import { useAxiosJwt } from '../AxiosIntercept/useAxios';
import Themed from '../Helpers/Themes';
import UserCard from './UserCards';
import './dropdownSearch.css';

const DropdownSearchResults: React.FC = () => {
    const { theme } = useTheme();
    const [showSearchResult, setShowSearchResult] = React.useState<boolean>(false);
    const [searchResult, setSearchResult] = React.useState<Array<{ user: string, email: string, id: number, created_at: string }>>([]);
    const [searchHandler, setSearchHandler] = React.useState<ReturnType<typeof setTimeout>>();
    const [searchUser, setSearchUser] = React.useState<string>("");
    const axios = useAxiosJwt();
    const [width, setWidth] = React.useState<number>(window.innerWidth);

    const searchForUser = (username: string) => {
        axios.get(`/finduser/${username}`).then((response) => {
            console.log(response.data);
            setSearchResult(response.data?.users);
            setShowSearchResult(true);
        }).catch((error) => {
            console.log(error);
        });
    }

    React.useEffect(() => {
        window.addEventListener('resize', () => {
        setWidth(window.innerWidth);
        }
        );
        return () => {
            window.removeEventListener('resize', () => {
                setWidth(window.innerWidth);
            });
        }
    }, []);

    return (
        <div onMouseLeave={
            () => {
                console.log('mouse leave');
                if (searchHandler) {
                    clearTimeout(searchHandler);
                }
                setSearchHandler(setTimeout(() => { setShowSearchResult(false) }, 200));
            }
        } >
            <div className={Themed("input-search-div")}>
                <input type='text' placeholder='Search a User' onChange={(e) => {
                    setSearchUser(e.target.value);
                    if (searchHandler) {
                        clearTimeout(searchHandler);
                    }
                    setSearchHandler(setTimeout(() => { searchForUser(e.target.value); console.log("res") }, 200));
                }}
                    onMouseEnter={
                        () => {
                            console.log('mouse enter');
                            if (searchUser.length > 0) {
                                if (searchHandler) {
                                    clearTimeout(searchHandler);
                                }
                                setSearchHandler(setTimeout(() => { setShowSearchResult(true) }, 200));
                            }
                        }
                    }
                />
            </div>
            <div data-bs-theme={theme} >
                <div style={{
                    position: 'absolute',
                    zIndex: 10,
                    margin: 'auto',
                    flexDirection: 'column',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    left: width < 400 ? '0vw': '10vw',
                    visibility: showSearchResult ? 'visible' : 'hidden',

                    }}>
                    <div style={{
                        maxHeight: '60vh',
                        overflowY: 'scroll',
                        overflowX: 'hidden',
                        scrollbarWidth: 'none',
                        backgroundColor: theme === "dark" ? '#000': '#bbb',
                        borderRadius: '5px',
                        margin: 'auto',
                        width: width < 400 ? '100vw' : '80vw',
                        }}>
                        {
                            searchResult.map((post, index) => {
                                return <UserCard key={index} username={post.user} mail={post.email} created_at={post.created_at} onClick={() => { console.log(post.id) }} />
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DropdownSearchResults;