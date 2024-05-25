import { useState, useEffect } from "react";
import { userContext } from "./userContext";
import propTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";

function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [auth_loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    async function login (e) {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;

        const response = await fetch('/test/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if(!data.user) {
            return data.message;
        }
        else {
            setUser(data.user);
            navigate('/');
        }
    }

    async function logout() {
        const response = await fetch('/test/logout', {
            method: 'POST',
        });

        if(response.status === 200) {
            setUser(null);
            navigate('/login');
        }
    }

    useEffect(() => {
        (async() => {
            setLoading(true);
            try {
                const response = await fetch('/test/isauth');
                const data = await response.json();

                if(data.user) {
                    setUser(data.user);
                    console.log(data.user);
                }
                else {
                    setUser(null);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        })();
    }, [location]); // run this effect everytime the location changes

    return (
        <userContext.Provider value={{ user, auth_loading, login, logout }}>
            {children}
        </userContext.Provider>
    );
}

UserProvider.propTypes = {
    children: propTypes.node.isRequired,
};

export default UserProvider;