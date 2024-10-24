import '../Css/general.css';
import '../Css/Dashboard.css';

import React, { useEffect, useRef,useState } from 'react';
import { useAxiosJwt } from '../AxiosIntercept/useAxios';
import { useAuth } from '../Context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import PostInfo from '../Types/PostInfo';
import {Camera} from "react-camera-pro";

import { APIProvider, Map, MapCameraChangedEvent } from '@vis.gl/react-google-maps';

const Others: React.FC = () => {
    const axios = useAxiosJwt();
    const [userInfo, setUserInfo] = React.useState<{ user: string, email: string, id: number } | undefined>(undefined);
    const [myPosts, setPosts] = React.useState<PostInfo[]>([]);
    const navigator = useNavigate();
    const location = useLocation();
    const { userId } = useAuth();

    const camera = useRef<any>(null);
    const [image, setImage] = useState<any>(null);

    return (
        <APIProvider apiKey={'AIzaSyC8DEHDhICdfLiQI45tVk5mFIC0xtk_ysg'} onLoad={() => console.log('Maps API has loaded.')}>
            <div className='outer-dashboard-div'>
                <div>
                    <Camera ref={camera} errorMessages={{noCameraAccessible: "no camera", permissionDenied:"permissind denied", switchCamera: "swtich", canvas:"canvas"}} />
                    <button onClick={() => setImage(camera.current.takePhoto())}>Take photo</button>
                    <img src={image} alt='Taken photo' />
                </div>
            </div>
        </APIProvider>
    );
};

export default Others;