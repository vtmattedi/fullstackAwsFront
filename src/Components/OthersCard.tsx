import React, { useEffect, useRef } from 'react';
import logo from '../Assets/noprofile.svg';
import '../Css/myCard.css'
import { useAxios } from '../AxiosIntercept/useAxios';
import { useTheme } from '../Context/MyThemeContext';
import GoBackButton from './GoBackButton';
import { ThreeDot } from 'react-loading-indicators';

interface MyCardProps {
    info?: {
        user: string;
        email: string;
        id: number;
    }
}

const MyCard: React.FC<MyCardProps> = ({ info }) => {

    const [editMode, setEditMode] = React.useState(false);
    const [currentUser, setCurrentUser] = React.useState<string | undefined>(undefined);
    const { theme, toggleTheme } = useTheme();
    const [width, setWidth] = React.useState<number>(window.innerWidth);

    const captilize = (str?: string) => {
        if (str)
            return str?.charAt(0)?.toUpperCase() + str.slice(1);
    }

    useEffect(() => {
        setCurrentUser(info?.user);
        window.addEventListener('resize', () => {
            setWidth(window.innerWidth);
        });
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
                                <div>
                                    {
                                        currentUser ?
                                            captilize(info?.user) : <ThreeDot color={"orange"} style={{ marginLeft: "1vw" }}></ThreeDot>
                                    }
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
                <div className='w-100'>
                    {
                        <p className='email'
                            style={{
                                visibility: currentUser ? "visible" : "hidden",
                            }}>{info?.email || "no email"}
                        </p>
                    }
                </div>
            </div>
        </div>

    );
};

export default MyCard;