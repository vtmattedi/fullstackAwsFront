import React from 'react';
import Logo from '../logo2.svg';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
const NotFound = () => {
    const Navigate = useNavigate();
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            fontFamily: 'Arial, sans-serif',
            color: 'orange'
        }}>
            <img src={Logo} alt="Logo" style={{
                width: '40vh',
            }}/>
            <h1>404 - Not Found</h1>
            <h5 style={{padding:'10px'}}>These are not the driods you are looking for.</h5>
            <Button variant="outline-warning" onClick={()=> { Navigate("/")}}>Continue the search</Button>
        </div>
    );
};

export default NotFound;