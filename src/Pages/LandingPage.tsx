import React, { useEffect } from 'react';
import { useGlobalContext } from '../Context/GlobalLoadingAndAlert';
import { useRefreshToken } from '../AxiosIntercept/useAxios';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
    const getToken = useRefreshToken();
    const navigator = useNavigate();
    const globalCtx = useGlobalContext();

    useEffect(() => {
        globalCtx.setLoadingText("Loading");
        globalCtx.setShowLoading(true);
        getToken().then(
            (response) => {
                if (response) {
                   navigator('/dashboard', { replace: true });
                }
                else {
                   navigator('/login', { replace: true });
                }
            }
        ).finally(() => {
          globalCtx.setShowLoading(false);
        });
    }, []);

    return (
        <div>
            <p>Loading... But you should never see this</p>
        </div>
    );
};

export default LandingPage;