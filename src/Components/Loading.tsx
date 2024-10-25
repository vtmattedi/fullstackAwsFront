import '../Css/loading.css';
import React, { useEffect } from 'react';
import { FourSquare } from 'react-loading-indicators';
import Logo from '../Assets/logo2.svg';
interface LoadingProps {
    text?: String;

}
const Loading: React.FC<LoadingProps> = ({ text }) => {
    const [points, setPoints] = React.useState(0);
    const handlePoints = () => {
        setPoints(points + 1);
        if (points === 3) {
            setPoints(0);
        }
    };
    useEffect(() => {
        const interval = setInterval(() => {
            handlePoints();
        }, 400);
        return () => clearInterval(interval);
    }, [points]);
    return (
        <div className='block-screen'>
            <div className="bg-div">
                <img src={Logo} alt='logo' className='logo'></img>
                <div className='loader'>
                <FourSquare color="orange" size="small" text=""  textColor="#b71010" />
                </div>
                <p className='text'>{(text || "Loading") + " " +".".repeat(points)}</p>
            </div>
        </div>
    );
};

export default Loading;