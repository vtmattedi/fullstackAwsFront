import React, { useEffect, useRef } from 'react';
import logo from '../Assets/profile.jpeg';
import noProfile from '../Assets/noprofile.svg';
import '../Css/myCard.css'
import { useAxiosJwt, useAxios } from '../AxiosIntercept/useAxios';
import { useAuth } from '../Context/AuthContext';
import { Dropdown, DropdownButton, Button, Modal } from 'react-bootstrap';
import { useTheme } from '../Context/MyThemeContext';
import Themed from '../Helpers/Themes';
import { useNavigate } from 'react-router-dom';
import Menu from './menu';
import { useGlobalContext } from '../Context/GlobalLoadingAndAlert';
import { Tooltip } from 'react-tooltip';
import { BlinkBlur, ThreeDot } from 'react-loading-indicators';

interface MyCardProps {
    info?: {
        user: string;
        email: string;
        id: number;
    }
    setInfo?: React.Dispatch<React.SetStateAction<{ user: string; email: string; id: number; } | undefined>>;
}

const MyCard: React.FC<MyCardProps> = ({ info, setInfo }) => {

    const [editMode, setEditMode] = React.useState(false);
    const [currentUser, setCurrentUser] = React.useState("");
    const [showConfirm, setShowConfirm] = React.useState(false);
    const [showDeletion, setShowDeletion] = React.useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const axios = useAxiosJwt();
    const axiosLogout = useAxios();
    const { theme, toggleTheme } = useTheme();
    const [width, setWidth] = React.useState<number>(0);
    const { handleLogout } = useAuth();
    const navigator = useNavigate();
    const globalCtx = useGlobalContext();

    const deleteAccount = () => {
        setShowDeletion(false);
        globalCtx.setLoadingText('Deleting Account');
        globalCtx.setShowLoading(true);
        axiosLogout.delete('/deleteaccount').then((response) => {
            globalCtx.setShowLoading(false);
            globalCtx.addAlert({ title: 'Account Deleted', text: 'Account has been deleted successfully.' });
            handleLogout();
            navigator('/login');

        }).catch((error) => {
            globalCtx.setShowLoading(false);
            globalCtx.addAlert({ title: 'Account could not be deleted.', text: error.response.data.message });

        })

    }

    const captilize = (str?: string) => {
        if (str)
            return str?.charAt(0)?.toUpperCase() + str.slice(1);
    }
    const btnClick = () => {
        setTimeout(() => {
            if (!editMode && inputRef.current)
                inputRef.current.focus();
        }, 0);
        if (editMode) {
            if (currentUser) {
                axios.post('/edituser', {
                    username: currentUser
                }).then((response) => {
                    if (setInfo)
                        setInfo({ user: currentUser, email: info?.email || "", id: info?.id || 0 });
                }).catch((error) => {
                    console.log(error);
                    globalCtx.addAlert({ title: 'Username not Changed!', text: error.response.data.message });
                }).finally(() => {
                    setCurrentUser(captilize(info?.user) || "");
                });
            }
        }

        setEditMode(!editMode);
    }
    const logout = (everywhere?: boolean) => {
        handleLogout();
        let logout = `/logout`;
        if (everywhere) {
            logout = `/logoutEveryone`;
        }
        axiosLogout.delete(logout).then((response) => {
            console.log(response.data);
        }
        ).catch((error) => {
            console.log(error);
        }).finally(() => {
            setShowConfirm(false);
            navigator('/');
        });

    }
    useEffect(() => {
        setCurrentUser(captilize(info?.user) || "");
        window.addEventListener('resize', () => {
            setWidth(window.innerWidth);
        }
        );
        return () => {
            window.removeEventListener('resize', () => {
                setWidth(window.innerWidth);
            });
        }
    }, [info?.user]);

    return (
        <div className='outer-div' style={{
            backgroundColor: theme === "dark" ? "#333" : "#aaa",
            color: theme === "dark" ? "white" : "black"
        }}>
            <div className='top-mycard-div'>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: "100%",
                    }}
                >
                    <div>
                        <div className='img-title-div'>
                            {
                                currentUser === "" ?
                                    <img src={noProfile} className='profile-photo' alt='profile'
                                        data-tooltip-id='profile-pic-tooltip' /> :
                                    <img src={logo} className='profile-photo' alt='profile'
                                        data-tooltip-id='profile-pic-tooltip' />

                            }

                            <div className='username-div' >
                                <div className={'username'} style={{ display: editMode ? 'none' : 'block', color: theme === "dark" ? "white" : "black" }}>
                                   
                                <div>
                                    {
                                        currentUser === "" ? <ThreeDot color={"orange"} style={{ marginLeft: "1vw" }}></ThreeDot> :
                                            captilize(info?.user)
                                    }
                                </div>
            
                                </div>
                                <input ref={inputRef} type='text' value={currentUser} onChange={(e) => setCurrentUser(e.target.value)}
                                    className={Themed('username username-input')} style={{ display: editMode ? 'block' : 'none' }} />
                            </div>
                        </div>
                        {
                               <p className='email'
                               style={{
                                   visibility: currentUser ? "visible" : "hidden",
                               }}>{info?.email || "no email"}</p>
                        }

                    </div>
                    <div>
                        <Menu>
                            <div className='d-flex flex-column justify-content-center align-items-center '>
                                <div className='button-div gap-2'>
                                    <Button onClick={btnClick}
                                        style={{ width: '60px' }}
                                        variant={editMode ? 'danger' : 'secondary'}
                                        data-tooltip-id='edit-tooltip'
                                    >{editMode ? "Save" : "Edit"}</Button>
                                    <DropdownButton title={"Logout"} variant='danger' data-bs-theme={theme}>
                                        <Dropdown.Item as="button" onClick={() => { logout(false) }}>Logout</Dropdown.Item>
                                        <Dropdown.Item as="button" onClick={() => { setShowConfirm(true) }}>Logout Everywhere</Dropdown.Item>
                                    </DropdownButton>

                                </div>

                                <Button onClick={() => { toggleTheme() }}
                                    style={{
                                        width: '95%',
                                        padding: '2px',
                                        backgroundColor: theme === 'dark' ? '#bbb' : '#333',
                                        color: theme === 'dark' ? 'black' : 'white',
                                        fontFamily: 'inherit',
                                        fontWeight: 'bold'
                                    }}>

                                    {(theme === "dark" ? "Light" : "Dark") + " Theme"}</Button>
                                <Button onClick={() => setShowDeletion(true)} variant={'danger'}
                                    style={{
                                        width: '95%',
                                        padding: '2px',
                                        marginTop: '5px',
                                        fontFamily: 'inherit',
                                        fontWeight: 'bold'
                                    }}
                                >{"Delete Account"}</Button>
                                <Modal show={showConfirm} centered data-bs-theme={theme} style={
                                    {
                                        color: theme === 'dark' ? 'white' : 'black'
                                    }
                                }>
                                    <Modal.Header >
                                        <Modal.Title id="contained-modal-title-vcenter" >
                                            You are about to logout every session of your account
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>Are you sure?</Modal.Body>
                                    <Modal.Footer>
                                        <Button onClick={() => { setShowConfirm(false) }}>Cancel</Button>
                                        <Button variant="danger" onClick={() => { logout(true) }}>Yes</Button>
                                    </Modal.Footer>
                                </Modal>
                                <Modal show={showDeletion} centered data-bs-theme={theme} style={
                                    {
                                        color: theme === 'dark' ? 'white' : 'black'
                                    }
                                }>
                                    <Modal.Header >
                                        <Modal.Title id="contained-modal-title-vcenter" >
                                            Delete Account
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>You are about to delete your account, if you do so, your email will be
                                        deleted from our database and it will be able to create a new account with the same email.
                                        Besides that, your posts will <b>NOT</b> be deleted if you want to delete them, delete them before deleting your account.
                                        However no one will be able to see your username or email from the posts.
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button onClick={() => { setShowDeletion(false) }}>Cancel</Button>
                                        <Button variant="danger" onClick={() => { deleteAccount() }}>Confirm</Button>
                                    </Modal.Footer>
                                </Modal>
                            </div>
                        </Menu>
                    </div>
                </div>
            </div>
            <Tooltip className={"tooltip-custom"} id={"edit-tooltip"}
                delayShow={300}>You can edit your user name!</Tooltip>
            <Tooltip place={'bottom'}
                className={"tooltip-custom"} id={"profile-pic-tooltip"}>Your picture would go here</Tooltip>
        </div>
    );
};

export default MyCard;