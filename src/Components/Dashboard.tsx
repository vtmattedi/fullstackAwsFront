import React, { useEffect } from 'react';
import { useAuth } from '../Context/Authcontext';
import { useAxiosJwt, useAxios } from '../AxiosIntercept/useAxios';
import MyCard from './MyCard';
import Post from './Posts/Posts';
interface DashboardProps {
    handleLoading: (loading: boolean, statement?: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ handleLoading }) => {
    const axios = useAxiosJwt();
    const axiosLogout = useAxios();
    const [data, setData] = React.useState<string>("");
    const { handleLogout } = useAuth();
    const [disableRefresh, setDisableRefresh] = React.useState(false);
    const [myInfo, setMyInfo] = React.useState<{ user: string, email: string, id: number } | undefined>(undefined);
    const logout = () => {
        handleLogout();
        axiosLogout.delete('/logout').then((response) => {
            console.log(response.data);
        }
        ).catch((error) => {
            console.log(error);
        });

    }

    const updateData = async () => {
        setDisableRefresh(true);
        axios.get('/dashboard').then((response) => {
            setMyInfo(response.data);
            setData(JSON.stringify(response.data, null, 1).replace("{\n", "").replace("\n}", ""));

        }).catch((error) => {
            console.log(error);
        }
        ).finally(() => {
            setDisableRefresh(false);
        });
    }

    const getOthers = async () => {
        axios.get('/others').then((response) => {
            if (response?.data?.users) {
                const users = response.data.users;
                setData(JSON.stringify(users, null, 1).replace("{\n", "").replace("\n}", ""));
            }
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
        }
        );
    }

    const handleDelete = (id: number) => {	
        axios.delete(`/post/${id}`).then((response) => {	
            console.log(response.data);	
        }).catch((error) => {	
            console.log(error);	
        });	
    }

    useEffect(() => {
        updateData();
    }, []);
    return (
        <div>
            <MyCard info={myInfo} setInfo={setMyInfo}></MyCard>
            <h1>Dashboard</h1>
            <p>Welcome to the dashboard!</p>
            <div>
                <input type='text' placeholder='User Name'/>
                <button>Search</button>
            </div>
            <div>
                <Post title='sample' text='lorem ipsum' onDelete={() => {handleDelete(2)}}/>
            </div>
            <button onClick={logout}>log out</button>
            <button onClick={updateData} disabled={disableRefresh}>refresh data</button>
            <button onClick={getOthers}>get others</button>
            <button onClick={getOthers}>post</button>
        </div>
    );
};

export default Dashboard;