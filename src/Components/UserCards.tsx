import React from 'react';
import { Card, DropdownButton, Dropdown } from 'react-bootstrap';
import '../Css/UserCards.css';
import  calc_time  from '../Helpers/Time';
import Themed from '../Helpers/Themes';
import { useTheme } from '../Context/MyThemeContext';
interface UserCardProps {
    username: string;
    mail: string;
    created_at: string;
    onClick: () => void;
}



const UserCard: React.FC<UserCardProps> = ({ username, mail, created_at, onClick }) => {
    const { theme } = useTheme();
    return (
        <Card onClick={onClick} className='card-users' data-bs-theme={theme}>
            <Card.Header>
                <div className='card-users-title'>
                    <div className='card-users-title-username'>
                    {username}
                    </div>
                    <div className='card-users-title-time'>
                    {"Created: " + calc_time(created_at)}
                    </div>
                </div>
            </Card.Header>
            <Card.Body>
                <p>{mail}</p>
            </Card.Body>
        </Card>
    );
};

export default UserCard;