import React, { useEffect, useRef } from 'react';
import logo from '../logo.svg';
import './myCard.css'
import { useAxiosJwt } from '../AxiosIntercept/useAxios';

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
    const inputRef = useRef<HTMLInputElement | null>(null);
    const axios = useAxiosJwt();
    const captilize = (str?: string) => {
        if (str)
            return str?.charAt(0)?.toUpperCase() + str.slice(1);
    }
    const btnClick = () => {
        if (!editMode) {
            inputRef.current?.focus();
        }
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
    useEffect(() => {
        setCurrentUser(captilize(info?.user) || "");
    }, [info?.user]);
    return (
        <div className='outer-div'>
            <div className='img-title-div'>
                <img src={logo} className='profile-photo' alt='profile'/>
                <div className='username-div'>
                    {
                    !editMode ?
                        <div className='username'>
                            {captilize(info?.user)}
                        </div> :
                        <input type='text' value={currentUser} onChange={(e) => setCurrentUser(e.target.value)}
                            className='username username-input' ref={inputRef}/>   
                    }
                </div>
                <button className='edit-button' onClick={btnClick} >{editMode ? "Save" : "Edit"}</button>
            </div>
            <p className='email'>{info?.email||"No email"}</p>
        </div>
    );
};

export default MyCard;