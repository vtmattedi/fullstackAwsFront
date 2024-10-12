import React, { useEffect, useRef } from 'react';
import logo from '../profile1.jpeg';
import './myCard.css'
import { useAxiosJwt, useAxios } from '../AxiosIntercept/useAxios';
import { useAuth } from '../Context/AuthContext';
import { Dropdown, DropdownButton, Button, Modal } from 'react-bootstrap';
import { useTheme } from '../Context/MyThemeContext';
import calc_time from '../Helpers/Time';
import { useNavigate } from 'react-router-dom';

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
    const [currentMail, setCurrentMail] = React.useState(info?.email);
    const [showConfirm, setShowConfirm] = React.useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const axios = useAxiosJwt();
    const axiosLogout = useAxios();
    const { theme, toggleTheme } = useTheme();
    const { handleLogout } = useAuth();
    const navigator = useNavigate();

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
                axios.post('/update', {
                    username: currentUser
                }).then((response) => {
                    if (setInfo)
                        setInfo({ user: currentUser, email: info?.email || "", id: info?.id || 0 });
                }).catch((error) => {
                    console.log(error);
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
            navigator('/login');
        });

    }
    useEffect(() => {
        setCurrentUser(captilize(info?.user) || "");
    }, [info?.user]);

    return (
        <div className='outer-div'>
            <div className='top-mycard-div'>
                <div className='img-title-div'>
                    <img src={logo} className='profile-photo' alt='profile' />
                    <div className='username-div'>
                        <div className='username' style={{ display: editMode ? 'none' : 'block' }}>
                            {captilize(info?.user)}
                        </div>
                        <input ref={inputRef} type='text' value={currentUser} onChange={(e) => setCurrentUser(e.target.value)}
                            className='username username-input' style={{ display: editMode ? 'block' : 'none' }} />

                    </div>
                </div>
                <div className='d-flex flex-column justify-content-center align-items-center'>
                    <div className='button-div gap-2'>
                        <Button onClick={btnClick}
                            style={{ width: '60px' }}
                            variant={editMode ? 'danger' : 'secondary'}
                        >{editMode ? "Save" : "Edit"}</Button>
                        <DropdownButton title={"Logout"} variant='danger' data-bs-theme={theme}>
                            <Dropdown.Item as="button" onClick={() => { logout() }}>Logout</Dropdown.Item>
                            <Dropdown.Item as="button" onClick={() => { setShowConfirm(true) }}>Logout Everywhere</Dropdown.Item>
                        </DropdownButton>
                    </div>

                    <Button onClick={() => { toggleTheme("1000") }}
                        style={
                            {
                                width: '95%',
                                padding: '2px',
                                backgroundColor: theme === 'dark' ? '#bbb' : '#333',
                                color: theme === 'dark' ? 'black' : 'white',
                                fontFamily: 'inherit',
                                fontWeight: 'bold'
                            }
                        }>
                        {(theme === "dark" ? "Light" : "Dark") + " Theme"}</Button>
                </div>
            </div>
            <p className='email'>{info?.email || "No email"}</p>
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
        </div>

    );
};

export default MyCard;