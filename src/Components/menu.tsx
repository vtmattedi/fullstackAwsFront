import React, { Children, useEffect } from 'react';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { useTheme } from '../Context/MyThemeContext';
import { Modal } from 'react-bootstrap';

interface MenuProps {
    children?: React.ReactNode;
    style?: React.CSSProperties;
}

const Menu: React.FC<MenuProps> = ({ children, style}) => {
    const { theme } = useTheme();

    const [width, setWidth] = React.useState<number>(window.innerWidth);
    useEffect(() => {
        
        window.addEventListener('resize', () => {
            setWidth(window.innerWidth);
        });
        return () => {
            window.removeEventListener('resize', () => {
                setWidth(window.innerWidth);
            });
        }
    }, []);
    return (
        <div style={width< 600?{
            display: 'flex',
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            right: '8vw',
            top: '2vh',
            }:
            {
                display: 'flex',
            }}>
            {
            width > 600 ? <>{children}</> :
                <DropdownButton id="dropdown-basic-button" title="Menu" data-bs-theme={theme}>
                   {
                Children.count(children) > 1 ? children : <>{children}</>
                   }

                </DropdownButton>

            }
        </div>
    );
};

export default Menu;