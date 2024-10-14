import React from 'react';
import { Button } from 'react-bootstrap';
import Themed from '../Helpers/Themes';
import { useTheme } from '../Context/MyThemeContext';
import { useNavigate } from 'react-router-dom';
const GoBackButton = () => {
    const {theme} = useTheme();
    const navigator = useNavigate();
    return (
        <Button variant='outline-secondary'
            style={{
                fontSize: "1.5rem",
                color: theme === "dark" ? "white" : "black",
                borderColor: theme === "dark" ? "white" : "black",
                border: "2px solid",
                borderRadius: "40%"
            }}
            onClick={() => {
                navigator(-1);
            }}
            className={Themed("bt-back-others") + 'bi bi-arrow-left'}
        ></Button>
    );
};

export default GoBackButton;