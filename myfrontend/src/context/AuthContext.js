import React, {createContext, useState, useContext, useEffect} from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    // You might want to check the authentication state when the app loads
    useEffect(() => {
        const verifyAuthentication = async () => {
            try {
                const response = await fetch('/api/verify_auth', {
                    method: 'GET',
                    // credentials: 'include',  // Include credentials
                });

                setIsAuthenticated(response.ok);
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
        <AuthContext.Provider value={{ isAuthenticated, setAuthenticated,  logout}}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);