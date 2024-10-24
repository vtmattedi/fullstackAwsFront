import React, { useEffect, useState } from 'react';
import { ErrorProps } from './Interfaces/ErrorMessage';
import { useAxios } from '../AxiosIntercept/useAxios';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../Context/GlobalLoadingAndAlert';
import { Tooltip } from 'react-tooltip';

const SignupForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [autoUser, setAutoUser] = useState(true);
    const [width, setWidth] = React.useState(window.innerWidth);
    const axios = useAxios();
    const [errors, setErrors] = React.useState<Array<ErrorProps>>([]);
    const { handleToken } = useAuth();
    const navigator = useNavigate();
    const { setShowLoading,setLoadingText } = useGlobalContext();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setLoadingText("Signing up");
        setShowLoading(true);
        if (password !== passwordConfirm) {
            setErrors([{ target: 'passwordConfirm', message: 'Passwords do not match' }]);
            setShowLoading(false);
            return;
        }

        const parseError = (message: string) => {
            setErrors([]);
            console.log("Error:", message);
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
        }

        axios.post('/signup', {
            username: username,
            email: email,
            password: password
        }).then((response) => {
            console.log(response);
            if (response?.data?.accessToken) {
                handleToken(response.data.accessToken);
                console.log("token:", response.data.accessToken);
            }
            setShowLoading(false);
            navigator("/dashboard");
        }).catch((error) => {
            console.log(error.response.data.message);
            if (!error.response?.data) {
                setErrors([{ target: 'body', message: 'Server error.' }]);
            }
            else
                parseError(error.response?.data?.message);
        }).finally(() => {
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
            <form onSubmit={handleSubmit}>
                {errors?.filter((error) => error.target === 'body').map((error, index) => <p key={index} className='error-text'>{error.message}</p>)}
                <div className='middle-div'>
                    <div className="input-div" style={
                        {
                            flexDirection: width < 400 ? 'column' : 'row'
                        }
                    }>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (autoUser) {
                                    setUsername(e.target.value.split('@')[0]);
                                }
                            }}
                            required
                            data-tooltip-id='signup-email-tooltip'
                        />
                    </div>
                    {errors?.filter((error) => error.target === 'email').map((error, index) => <p key={index} className='error-text'>{error.message}</p>)}
                </div>
                <div className='middle-div'>
                    <div className="input-div" style={
                        {
                            flexDirection: width < 400 ? 'column' : 'row'
                        }
                    }>
                        <label>User:</label>
                        <input
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setAutoUser(e.target.value === '');
                            }}
                            required
                        />
                    </div>
                    {errors?.filter((error) => error.target === 'user').map((error, index) => <p key={index} className='error-text'>{error.message}</p>)}
                </div>
                <div className='middle-div'>
                    <div className="input-div" style={
                        {
                            flexDirection: width < 400 ? 'column' : 'row'
                        }
                    }>
                        <label>Password:</label>
                        <input
                            type="password"
                            autoComplete='new-password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {errors?.filter((error) => error.target === 'password').map((error, index) => <p key={index} className='error-text'>{error.message}</p>)}
                </div>
                <div className='middle-div'>
                    <div className="input-div" style={
                        {
                            flexDirection: width < 400 ? 'column' : 'row'
                        }

                    }>
                        <label style={{
                            fontSize: '0.68em'
                        }}>Confirm Password:</label>
                        <input
                            type="password"
                            value={passwordConfirm}
                            autoComplete='new-password'
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            required
                        />
                    </div>
                    {errors?.filter((error) => error.target === 'passwordConfirm').map((error, index) => <p key={index} className='error-text'>{error.message}</p>)}
                </div>

                <button type="submit" className='go-button'>Sign Up</button>
            </form>
            <Tooltip className={"tooltip-custom"} id={"signup-email-tooltip"}>You can use a mock email here!</Tooltip>
        </div>
    );
};

export default SignupForm;