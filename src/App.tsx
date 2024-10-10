import React, { useEffect, useRef, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.svg';
import './App.css';
import SignupForm from './Components/SignupForm';
import LoginForm from './Components/LoginForm';
import Loading from './Components/Loading';
import './common.css';
import { AuthProvider, useAuth } from './Context/Authcontext';
import Nav from 'react-bootstrap/Nav';
import { useAxios, useAxiosJwt, useRefreshToken } from './AxiosIntercept/useAxios';
import { ErrorProps } from './Components/Interfaces/ErrorMessage';
import Dashboard from './Components/Dashboard';

function App() {
  const [menu, setMenu] = React.useState('login');
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [loadingStatement, setLoadingStatement] = React.useState('Loading');
  const getToken = useRefreshToken();
  const [firstLoad, setFirstLoad] = React.useState(true);

  useEffect( () => {
    if (firstLoad) {
      setFirstLoad(false);
       getToken().finally(() => {
        setTimeout(() => setLoading(false), 1000);
        });
    }
  }, []);


  const showLoading = (_loading: boolean, statement?: string) => {
    setLoadingStatement(statement || 'Loading');
    setLoading(_loading);

  }

  return (
    <div className='topdiv' style={{ color: 'white' }}>
      {!isAuthenticated &&
        <div>
          <Nav variant="underline" defaultActiveKey={menu}>
            <Nav.Item >
              <Nav.Link active={menu === 'login'} onClick={() => setMenu('login')}>Login</Nav.Link>
            </Nav.Item>
            <Nav.Item >
              <Nav.Link active={menu === 'signup'} onClick={() => setMenu('signup')}>Sign Up</Nav.Link>
            </Nav.Item>
          </Nav>
          {menu === 'login' ? <LoginForm handleLoading={showLoading} /> : <SignupForm handleLoading={showLoading} />}
          <div>


          </div>
        </div>}

      {loading ? <Loading text={loadingStatement} /> : <></>}
      {
        isAuthenticated && <div>
          <Dashboard handleLoading={showLoading} />
        </div>
      }
    </div>
  );
}

export default App;
