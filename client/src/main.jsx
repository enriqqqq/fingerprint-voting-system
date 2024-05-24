import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import UserProvider from './contexts/userProvider.jsx';
import './index.css'
import VotingPage from './pages/VotingPage.jsx'
import LoginPage from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Dashboard from './pages/Dashboard.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <VotingPage/>,
  },
  {
    path: "/login",
    element: <LoginPage/>,
  },
  {
    path: "/signup",
    element: <SignUp/>,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute element={<Dashboard/>}/>,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router}/>
    </UserProvider>
  </React.StrictMode>,
)
