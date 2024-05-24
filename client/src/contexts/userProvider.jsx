import { useState, useEffect } from "react";
import { userContext } from "./userContext";
import propTypes from "prop-types";

function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        (async() => {
            try {
                const response = await fetch('/test/isauth');
                const data = await response.json();
                console.log(data);
                if(data.error) {
                    setUser(null);
                    return;
                }
                setUser(data);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    return (
        <userContext.Provider value={{ user }}>
            {children}
        </userContext.Provider>
    );
}

UserProvider.propTypes = {
    children: propTypes.node.isRequired,
};

export default UserProvider;