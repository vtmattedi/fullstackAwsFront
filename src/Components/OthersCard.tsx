import React, { useEffect, useRef } from 'react';
import logo from '../noimage.svg';
import './myCard.css'
import { useAxiosJwt, useAxios } from '../AxiosIntercept/useAxios';
import { useAuth } from '../Context/AuthContext';
import { Dropdown, DropdownButton, Button, Modal } from 'react-bootstrap';
import { useTheme } from '../Context/MyThemeContext';
import Themed from '../Helpers/Themes';
import { useNavigate } from 'react-router-dom';
import Menu from './menu';
import GoBackButton from './GoBackButton';

interface MyCardProps {
    info?: {
        user: string;
        email: string;
        id: number;
    }
}

const MyCard: React.FC<MyCardProps> = ({ info }) => {

    const [editMode, setEditMode] = React.useState(false);
    const [currentUser, setCurrentUser] = React.useState("");
    const [showConfirm, setShowConfirm] = React.useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const axios = useAxiosJwt();
    const axiosLogout = useAxios();
    const { theme, toggleTheme } = useTheme();
    const [width, setWidth] = React.useState<number>(0);
    const { handleLogout } = useAuth();
    const navigator = useNavigate();



    const captilize = (str?: string) => {
        if (str)
            return str?.charAt(0)?.toUpperCase() + str.slice(1);
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
        <div className='outer-div d-flex flex-row ' style={{
            backgroundColor: theme === "dark" ? "#333" : "#aaa",
            color: theme === "dark" ? "white" : "black"
        }}>
            <div style={{
                top: "5px",
            }}>
                <GoBackButton />
            </div>

            <div>
            <div className='top-mycard-div'>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: "100%",


                    }}
                >
                    <div className='img-title-div'>

                        <img src={logo} className='profile-photo' alt='profile' />
                        <div className='username-div' >
                            <div className={'username'} style={{ display: editMode ? 'none' : 'block', color: theme === "dark" ? "white" : "black" }}>
                                {captilize(info?.user || "No user Name")}
                            </div>
                            <input ref={inputRef} type='text' value={currentUser} onChange={(e) => setCurrentUser(e.target.value)}
                                className={Themed('username username-input')} style={{ display: editMode ? 'block' : 'none' }} />
                        </div>
                    </div>

                </div>

            </div>
            <div className='w-100'>
            <p style={{margin: "auto", textAlign:"center"}} className='email'>{info?.email || "No Email"}</p>
            </div>
            </div>
        </div>

    );
};

export default MyCard;