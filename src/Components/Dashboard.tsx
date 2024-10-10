import React, { useEffect } from 'react';
import { useAuth } from '../Context/Authcontext';
import { useAxiosJwt, useAxios } from '../AxiosIntercept/useAxios';

interface DashboardProps {
    handleLoading: (loading: boolean, statement?: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({handleLoading}) => {
    const axios = useAxiosJwt();
    const axios2 = useAxios();
    const [data, setData] = React.useState<string>("");
    const {  handleLogout } = useAuth();
    const [disableRefresh, setDisableRefresh] = React.useState(false);
    const logout = () => {
        handleLogout();
        axios2.delete('/logout').then((response) => {
            console.log(response.data);
        }
        ).catch((error) => {
            console.log(error);
        });

    }

    const updateData = async () => {
        setDisableRefresh(true);
        axios.get('/dashboard').then((response) => {
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
    useEffect(() => {
        updateData();
    }, []);
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to the dashboard!</p>
            <div style={{maxHeight:'70vh',border:'solid 1px black',overflowY: 'scroll'}}>{data.split("\n").map((item:string, index:number)=>
            {   return <div key={index}>{item}<br/></div>;
            })}</div>
            <button onClick={logout}>log out</button>
            <button onClick={updateData} disabled={disableRefresh}>refresh data</button>
            <button onClick={getOthers}>get others</button>
        </div>
    );
};

export default Dashboard;