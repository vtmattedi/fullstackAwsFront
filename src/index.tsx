import 'bootstrap/dist/css/bootstrap.css';
import './Css/general.css';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './Context/AuthContext';
import { ThemeProvider } from './Context/MyThemeContext';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './Pages/notfound';
import Login from './Pages/login';
import Dashboard from './Pages/Dashboard';
import { GlobalProvider } from './Context/GlobalLoadingAndAlert';
import  LandingPage  from './Pages/LandingPage';
import Others from './Pages/Others';
import Globalfeed from './Pages/Globalfeed';


const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <NotFound />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <NotFound />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <NotFound />,
  },
  {
    path: "/globalfeed",
    element: <Globalfeed />,
    errorElement: <NotFound />,
  },
  {
    path: "/users/:id",
    element: <Others />,
    errorElement: <NotFound />,
  },
  {
    path: "/404",
    element: <NotFound />,
  },

]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(

  <AuthProvider>
    <ThemeProvider>
      <GlobalProvider>
        <div className='topdiv'>
          <div className='topdiv-sub1' >
            <App >
              <RouterProvider router={router} />
            </App>
          </div>
        </div>
      </GlobalProvider>
    </ThemeProvider>
  </AuthProvider >

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
