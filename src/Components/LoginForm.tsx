import React, { useEffect, useState } from 'react';
import './forms.css';
import { ErrorProps } from './Interfaces/ErrorMessage';
import Logo from '../logo2.svg';
import { useAxios } from '../AxiosIntercept/useAxios';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
interface LoginFormProps {
    handleLoading: (loading: boolean, statement?: string) => void;
}


const LoginForm: React.FC<LoginFormProps> = ({ handleLoading }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [width, setWidth] = React.useState(window.innerWidth);
    const [errors, setErrors] = React.useState<Array<ErrorProps>>([]);
    const { handleToken } = useAuth();
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
        handleLoading(true, "Logging in");
        setErrors([]);
        axios.post('/login', {
            email: email,
            password: password
        }).then((response) => {
        
            if (response?.data?.accessToken) {
                handleToken(response.data.accessToken);
            }
            navigator('/dashboard');
            handleLoading(false);
        }).catch((error) => {
            if (!error.response?.data) {
                setErrors([{ target: 'body', message: 'Server error.' }]);
            }
            console.log(error.response?.data);
            parseError(error.response?.data?.message);
            handleLoading(false);
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
                            required
                        />
                    </div>
                    {errors?.filter((error) => error.target === 'password').map((error, index) => <p key={index} className='error-text'>{error.message}</p>)}
                </div>
                <button type="submit" className='go-button'>Login</button>
            </form>
        </div>
    );
};

export default LoginForm;