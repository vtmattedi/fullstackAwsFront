import React, { useEffect, useRef, useMemo } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import '../App.css';
import SignupForm from '../Components/SignupForm';
import LoginForm from '../Components/LoginForm';
import Loading from '../Components/Loading';
import '../common.css';
import { useAuth } from '../Context/AuthContext';
import Nav from 'react-bootstrap/Nav';
import { useAxios, useAxiosJwt, useRefreshToken } from '../AxiosIntercept/useAxios';
import AboutMe from '../Components/AboutMe';
import {  useNavigate } from 'react-router-dom';

function App() {
  const [menu, setMenu] = React.useState('login');
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = React.useState(true);
  const [loadingStatement, setLoadingStatement] = React.useState('Loading');
  const getToken = useRefreshToken();
  const [firstLoad, setFirstLoad] = React.useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
      getToken().then(
        (response) => {
          if (response) {
            navigate('/dashboard', { replace: true });
          }
        }
      ).finally(() => {
        setLoading(false)});
    }
  }, []);


  const showLoading = (_loading: boolean, statement?: string) => {
    setLoadingStatement(statement || 'Loading');
    setLoading(_loading);

  }

  return (
    <div>
      {!isAuthenticated &&
        <div>
          <Nav variant="underline" defaultActiveKey={menu}>
            <Nav.Item >
              <Nav.Link active={menu === 'login'} onClick={() => setMenu('login')}>Login</Nav.Link>
            </Nav.Item>
            <Nav.Item >
              <Nav.Link active={menu === 'signup'} onClick={() => setMenu('signup')}>Sign Up</Nav.Link>
            </Nav.Item>
            <Nav.Item >
              <Nav.Link active={menu === 'about'} onClick={() => setMenu('about')}>About Project</Nav.Link>
            </Nav.Item>
          </Nav>
          {menu === 'login' && <LoginForm handleLoading={showLoading} />}
          {menu === 'signup' && <SignupForm handleLoading={showLoading} />}
          {menu === 'about' && <AboutMe />}
          <div>


          </div>
        </div>}

      {loading ?? <Loading text={loadingStatement} />}
    </div>
  );
}

export default App;
