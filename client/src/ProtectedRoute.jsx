import { useUser } from "./contexts/userContext";
import { Navigate } from "react-router-dom";
import propTypes from "prop-types";

function ProtectedRoute({ element }) {
    const { user } = useUser();
    if (!user) {
        return <Navigate to="/login" />;
    }
    return element;
}

ProtectedRoute.propTypes = {
    element: propTypes.node.isRequired,
};

export default ProtectedRoute;