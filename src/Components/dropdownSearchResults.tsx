import React from 'react';
import { useTheme } from '../Context/MyThemeContext';
import { useAxiosJwt } from '../AxiosIntercept/useAxios';
import Themed from '../Helpers/Themes';
import UserCard from './UserCards';
import '../Css/dropdownSearch.css';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

const DropdownSearchResults: React.FC = () => {
    const { theme } = useTheme();
    const [showSearchResult, setShowSearchResult] = React.useState<boolean>(false);
    const [searchResult, setSearchResult] = React.useState<Array<{ username: string, email: string, id: number, created_at: string }>>([]);
    const [searchHandler, setSearchHandler] = React.useState<ReturnType<typeof setTimeout>>();
    const [searchUser, setSearchUser] = React.useState<string>("");
    const axios = useAxiosJwt();
    const [width, setWidth] = React.useState<number>(window.innerWidth);
    const navigator = useNavigate();

    const searchForUser = (username: string) => {
        axios.get(`/finduser`,{params:{searchTerm: username}}).then((response) => {
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
            }}
            onKeyDown={
                (e) => {
                    if (e.key === 'Escape') {
                        setShowSearchResult(false);
                    }
                    else if (e.key === 'Enter') {
                        setShowSearchResult(false);
                    }
                }
            } >
            <div className={Themed("input-search-div")}>
                <input type='text' placeholder='Search a User' onChange={(e) => {
                    setSearchUser(e.target.value);
                    if (searchHandler) {
                        clearTimeout(searchHandler);
                    }
                    setSearchHandler(setTimeout(() => { searchForUser(e.target.value); }, 100));
                }} value={searchUser}
                data-tooltip-id='search-bar-tooltip'
                    onMouseEnter={
                        () => {
                            console.log('mouse enter');
                            if (searchUser?.length > 0) {
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
                            (searchResult.length === 0 && searchUser.length > 3) ? <div style={{
                                color: theme === "dark" ? 'white' : 'black',
                                textAlign: 'center',
                                border: '1px solid white',
                                fontSize: '1rem',
                                borderRadius: '5px',
                                width: width < 400 ? '100vw' : '80vw',

                            }}>{"No results found for: " + searchUser}</div> :
                            searchResult.map((user, index) => {
                                return <UserCard key={index} username={user.username} mail={user.email} created_at={user.created_at} onClick={() => { 
                                    setSearchUser("");
                                    if (searchHandler) {
                                        clearTimeout(searchHandler);
                                    }
                                    setShowSearchResult(false);
                                    setSearchResult([]);
                                    navigator("/users/" + user.id);
                                    
                                }} />
                            })
                        }
                    </div>
                </div>
            </div>
            <Tooltip className={"tooltip-custom"} id={"search-bar-tooltip"}>Press enter or type at least 3 letters to search</Tooltip>
        </div>
    );
};

export default DropdownSearchResults;