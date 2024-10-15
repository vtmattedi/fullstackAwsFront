import React, { useEffect } from 'react';
import '../App.css';
import SignupForm from '../Components/SignupForm';
import LoginForm from '../Components/LoginForm';
import '../common.css';
import { useAuth } from '../Context/AuthContext';
import Nav from 'react-bootstrap/Nav';
import { useRefreshToken } from '../AxiosIntercept/useAxios';
import AboutMe from '../Components/AboutMe';
import { useNavigate } from 'react-router-dom';

function App() {
  const [menu, setMenu] = React.useState('login');
  const { isAuthenticated } = useAuth();
  const getToken = useRefreshToken();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      console.log("isAuthenticated");
      navigate('/dashboard', { replace: true });
    }
    getToken().then(
      (response) => {
        console.log(response);
        if (response) {
          navigate('/dashboard', { replace: true });
        }
      }
    );

  }, [isAuthenticated]);

  return (
    <div>
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
        {menu === 'login' && <LoginForm />}
        {menu === 'signup' && <SignupForm />}
        {menu === 'about' && <AboutMe />}
        <div>


        </div>
      </div>
    </div>
  );
}

export default App;
