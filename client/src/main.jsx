import React from 'react'
import ReactDOM from 'react-dom/client'
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import UserProvider from './contexts/userProvider.jsx';
import './index.css'
import VotingPage from './pages/VotingPage.jsx'
import LoginPage from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Dashboard from './pages/Dashboard.jsx';
import RequireAuth from './components/RequireAuth.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <Routes>

          {/* These are public routes that do not require authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />

          {/* This is a protected route that requires authentication */}
          {/* If the user is not authenticated, they will be redirected to the login page */}
          <Route element={ <RequireAuth/> }>
            <Route path="/" element={<Dashboard />} />
            <Route path="/voting" element={<VotingPage />} />
          </Route>

        </Routes>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
