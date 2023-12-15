// LoginPage.js
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";

import movieLogo from '../styles/images/MovieLogo.png';

const LoginPage = () => {

    const navigate = useNavigate(); // Add this
    const { setAuthenticated } = useAuth(); // Add this

    const handleLoginSuccess = async (response) => {
        console.log("Login Success:", response);
        const token = response.credential;

        // Send the token to your backend for verification
        const res = await fetch('/api/google-authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (data.success) {
            localStorage.setItem('authToken', token); // Store the Google token directly
            setAuthenticated(true);
            navigate("/");
        } else {
            // Handle authentication failure
            console.error('Authentication failed:', data.error);
        }
    };



    const handleLoginFailure = (response) => {
        console.error('Login Failed:', response);
    };

    return (
        <div className="page-wrapper">
            <div className="login-container">
                <img src={movieLogo} alt="Movie Dashboard"></img>
                <h1 className="login-title">Movie Dashboard</h1>
                <GoogleLogin
                    size={"large"}
                    width={"300px"}
                    type={"standard"}
                    logo_alignment={"left"}
                    theme={"filled_black"}
                    className="google-login-button"
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginFailure}
                    useOneTap
                    prompt="select_account"
                />
            </div>
        </div>
    );
};
export default LoginPage;
