import { axiosInstanceJwt, axiosCredsInstance } from './axios';
import { useAuth } from '../Context/AuthContext';
import { useEffect } from 'react';
import { useGlobalContext } from '../Context/GlobalLoadingAndAlert';
import { useNavigate } from 'react-router-dom';

const useRefreshToken = () => {
    const { handleToken, handleLogout, setUserId } = useAuth();

    const RefreshToken = async () => {
        console.log("Refresh Token")
        let token = undefined;
        await axiosCredsInstance.post('/token').then((response) => {
            handleToken(response.data.accessToken);
            token = response.data.accessToken;
            console.log("uid", response.data.uid);
            setUserId(response.data.uid);

        }).catch((error) => {
            console.log(error);
            handleLogout();
        });
        return token;
    }

    return RefreshToken;
}

// Custom hook to use axios with JWT token
const useAxiosJwt = () => {
    const { token } = useAuth();
    const globalCtx = useGlobalContext();
    const navigation = useNavigate();
    // Request interceptor to add the JWT token to the headers
    const RefreshToken = useRefreshToken();
    useEffect(() => {
        const requestId = axiosInstanceJwt.interceptors.request.use(
            (config: any) => {
                if (token) {
                    if (!config.headers.Authorization)
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error: any) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor to handle errors
        const responseId = axiosInstanceJwt.interceptors.response.use(

            (response: any) => {
                return response;
            },
            async (error: any) => {
                const prevReq = error?.config;
                //If unauth -> 
                if (error.response && error.status === 401 && !prevReq?._retry) {
                    prevReq._retry = true;
                    console.log("Refreshing token...", Date.now() % 10000);
                    const newToken = await RefreshToken();
                    if (newToken) {
                        prevReq.headers.Authorization = `Bearer ${newToken}`;
                        console.log("Retrying request...", Date.now() % 10000);
                        // do not use axiosInstanceJwt here, it will cause it to reuse the same interceptor
                        // we need to update the interceptor to use the new token
                        // doing manually here.
                        return axiosInstanceJwt.request(prevReq);
                    }
                }
                else {
                    if (error.status === 401) {
                        globalCtx.addAlert({
                            title: "Session Expired",
                            text: "Please log in again"
                        })
                        console.log("Logging out");
                        navigation('/');
                    }
                    else if (error.status === 403) {
                        globalCtx.addAlert({
                            title: "Unauthorized",
                            text: "You do not have permission to do that"
                        })
                    }
                    return Promise.reject(error);
                }


            }
        );

        return () => {
            axiosInstanceJwt.interceptors.request.eject(requestId);
            axiosInstanceJwt.interceptors.response.eject(responseId);
        }
    }, [token, RefreshToken]);

    return axiosInstanceJwt;
}

const useAxios = () => {
    return axiosCredsInstance;
}


export { useAxiosJwt, useAxios, useRefreshToken };