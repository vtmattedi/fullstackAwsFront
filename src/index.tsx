import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './Context/AuthContext';
import { ThemeProvider } from './Context/MyThemeContext';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Router } from 'express';
import NotFound from './Pages/notfound';
import Login from './Pages/login';
import Dashboard from './Pages/Dashboard';
import "./common.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
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
  }

  // Add more routes here as needed
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(

  <AuthProvider>
    <ThemeProvider>
      <div className='topdiv'>
        <div className='topdiv-sub1' >
        <RouterProvider router={router} />
        </div>
      </div>
    </ThemeProvider>
  </AuthProvider >

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
