import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Css/general.css';
import Loading from './Components/Loading';
import { useGlobalContext } from './Context/GlobalLoadingAndAlert';
import { Button, Modal } from 'react-bootstrap';
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
