import React, { useEffect, Children } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import SignupForm from './Components/SignupForm';
import LoginForm from './Components/LoginForm';
import Loading from './Components/Loading';
import './common.css';
import { AuthProvider, useAuth } from './Context/AuthContext';
import Nav from 'react-bootstrap/Nav';
import { useRefreshToken } from './AxiosIntercept/useAxios';
import { useNavigate } from 'react-router-dom';

import AboutMe from './Components/AboutMe';
import { useGlobalContext } from './Context/GlobalLoadingAndAlert';
import { Alert, Button, Modal } from 'react-bootstrap';
import { useTheme } from './Context/MyThemeContext';

interface AppProps {
  children?: React.ReactNode;
}

const App: React.FC<AppProps> = ({ children }) => {
  const {theme} = useTheme();
  const globalCtx = useGlobalContext();


  return (
    <>
      {globalCtx.showLoading && <Loading text={globalCtx.loadingText || "Loading"} />}
      {children}
      <Modal show={globalCtx.showAlert} data-bs-theme={theme}>
        <Modal.Title> <div
          style={{ color: theme === 'dark' ? 'white' : 'black',
          textAlign: 'center',
          marginTop: '1vh',
           }}

        >{globalCtx.getCurrentAlert()?.title}</div></Modal.Title>
        <Modal.Body
        style={{ color: theme === 'dark' ? 'white' : 'black' }}
        >
          {globalCtx.getCurrentAlert()?.text}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={globalCtx.closeAlert} variant='danger'>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
