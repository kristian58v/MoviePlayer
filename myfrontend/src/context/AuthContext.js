import React, {createContext, useState, useContext, useEffect} from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [email, setEmail] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [lastName, setLastName] = useState(null);

    // You might want to check the authentication state when the app loads
    useEffect(() => {
        const verifyAuthentication = async () => {
            try {
                const response = await fetch('/api/verify_auth', {
                    method: 'GET',
                    // credentials: 'include',  // Include credentials
                });

                // Check if the response is ok
                if (response.ok) {
                    // Parse the JSON response
                    const data = await response.json();

                    // Set the states with the data from the response
                    setIsAuthenticated(true);
                    setEmail(data.email);
                    setFirstName(data.first_name);
                    setLastName(data.last_name);

                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                setIsAuthenticated(false);
            }
        };

        verifyAuthentication();
    }, []);

    const setAuthenticated = (authStatus) => {
        setIsAuthenticated(authStatus);
    };

    const logout = async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // credentials: 'include',  // Uncomment if needed
            });

            if (response.ok) {
                setIsAuthenticated(false);
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, setAuthenticated, logout, email, firstName, lastName}}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);