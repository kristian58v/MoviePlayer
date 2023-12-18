import React from 'react';
import {useGoogleLogin} from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import movieLogo from '../styles/images/MovieLogo.png';
import googleIcon from '../styles/images/google-icon.png';

import "../styles/login.css"

const LoginPage = () => {
    const navigate = useNavigate();
    const { setAuthenticated, setEmail, setFirstName, setLastName } = useAuth();

    const googleLogin = useGoogleLogin({
        ux_mode: 'popup',
        select_account: true,
        flow: 'auth-code',   // Set the flow to 'auth-code' for Authorization Code flow
        onSuccess: async (codeResponse) => {

            // Send the authorization code to your backend
            const res = await fetch('/api/exchange_code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // credentials: 'include',
                body: JSON.stringify({ code: codeResponse.code }),
            });

            const data = await res.json();

            if (data.message === "Success") {
                setAuthenticated(true);
                setEmail(data.email);
                setFirstName(data.first_name);
                setLastName(data.last_name);
                navigate("/");
            } else {
                // Handle authentication failure
                console.error('Authentication failed:', data.error);
            }
        },
        onError: (errorResponse) => {
            console.error('Login Failed:', errorResponse);
        },
        scope: 'openid email profile',  // Define the scopes you need
    });

    return (
        <div className="page-wrapper">
            <div className="login-container">
                <img src={movieLogo} alt="Movie Dashboard"></img>
                <h1 className="login-title">Movie Dashboard</h1>
                <button onClick={googleLogin} className="custom-google-login-button">
                    <img src={googleIcon} alt="Google sign-in" />
                    <span>Login with Google</span>
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
