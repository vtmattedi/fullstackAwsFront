import React, { useEffect, useState } from 'react';
import '../Css/forms.css';
import { ErrorProps } from '../Types/ErrorMessage';
import Logo from '../Assets/logo2.svg';
import { useAxios } from '../AxiosIntercept/useAxios';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../Context/GlobalLoadingAndAlert';
import { time } from 'console';
import { Tooltip } from 'react-tooltip';


const LoginForm: React.FC = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [width, setWidth] = React.useState(window.innerWidth);
    const [errors, setErrors] = React.useState<Array<ErrorProps>>([]);
    const { handleToken } = useAuth();
    const { setLoadingText, setShowLoading } = useGlobalContext();
    const navigator = useNavigate();

    const axios = useAxios();

    const parseError = (message: string) => {

        if (!message) {
            console.log("No message:", message);
            return;
        }
        const error = message.split(";");
        for (let i = 0; i < error.length; i++) {
            const target = error[i].split(":")[0];
            const message = error[i].split(":")[1];
            setErrors((prev) => [...prev, { target: target, message: message }]);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setErrors([]);
        setLoadingText("Logging in");
        setShowLoading(true);
        axios.post('/login', {
            email: email,
            password: password
        }).then((response) => {

            if (response?.data?.accessToken) {
                handleToken(response.data.accessToken);
            }
            setShowLoading(false);
            navigator('/dashboard');

        }).catch((error) => {
            if (!error.response?.data) {
                setErrors([{ target: 'body', message: 'Server error.' }]);
            }
            console.log(error.response?.data);
            parseError(error.response?.data?.message);
            setShowLoading(false);
        });

    };

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="outter-input-div">
            <img src={Logo} alt='logo' className='logo'></img>
            <form onSubmit={handleSubmit}>
                {errors?.filter((error) => error.target === 'body' || error.target === `creds`).map((error, index) => <p key={index} className='error-text'>{error.message}</p>)}

                <div className='middle-div'>
                    <div className="input-div" style={
                        {
                            flexDirection: width < 450 ? 'column' : 'row'
                        }
                    }>

                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            autoComplete="email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            data-tooltip-id='login-email-tooltip'
                        />
                    </div>
                    {errors?.filter((error) => error.target === 'email').map((error, index) => <p key={index} className='error-text'>{error.message}</p>)}
                </div>
                <div className='middle-div'>
                    <div className="input-div" style={
                        {
                            flexDirection: width < 450 ? 'column' : 'row'
                        }
                    }>
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            autoComplete="current-password"
                            onChange={(e) => setPassword(e.target.value)}
                            data-tooltip-id='login-password-tooltip'
                            required
                        />
                    </div>
                    {errors?.filter((error) => error.target === 'password').map((error, index) => <p key={index} className='error-text'>{error.message}</p>)}
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '0.5em',
                        gap: '0.5em',
                    }}
                >
                    <button type="button" className='go-button test-button' onClick={() => {
                        setEmail('test@test.com');
                        setPassword('test1234');
                    }}
                        data-tooltip-id='button-test-tooltip'
                    >Test User</button>
                    <button type="submit" className='go-button'>Login</button>
                </div>
            </form >
            <Tooltip id='login-email-tooltip' place='top'
                className='tooltip-custom'
            >Try out using test@test.com or create an account on the sign up page.</Tooltip>
            <Tooltip className='tooltip-custom' id='login-password-tooltip' place='top' >Enter your password or test1234 for the test account.</Tooltip>
            <Tooltip id='button-test-tooltip' place='top'
                className='tooltip-custom'
                delayShow={250}
            >Fill with user test@test.com</Tooltip>
        </div >

    );
};

export default LoginForm;