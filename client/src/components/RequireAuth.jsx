import { useUser } from "../contexts/userContext";
import { Navigate, Outlet } from "react-router-dom";

// This component is a wrapper for protected routes that require authentication
function RequireAuth() {
    const { user, auth_loading } = useUser();

    if(!auth_loading) {
        return user ? <Outlet /> : <Navigate to="/login" />;
    }
}   

export default RequireAuth;