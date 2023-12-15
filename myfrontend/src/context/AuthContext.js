import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(undefined);

const isTokenExpired = (token) => {
    try {
        const payloadBase64 = token.split('.')[1];
        const decodedJson = atob(payloadBase64);
        const decoded = JSON.parse(decodedJson);
        const exp = decoded.exp; // Token's expiry time
        const now = Date.now().valueOf() / 1000;
        return now > exp;
    } catch (e) {
        return true; // If there's an error in decoding, assume the token is invalid
    }
};

export const AuthProvider = ({ children }) => {

    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const token = localStorage.getItem('authToken');
        return !!token && !isTokenExpired(token);
    });

    const setAuthenticated = (authStatus) => {
        if (!authStatus) {
            localStorage.removeItem('authToken');
        }

        setIsAuthenticated(authStatus);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, setAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);