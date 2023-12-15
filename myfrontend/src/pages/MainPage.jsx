// src/pages/MainPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NavBar from "../components/nav/NavBar";
import { Routes, Route } from "react-router-dom";
import DiscoverPage from "./DiscoverPage";
import MediaPage from "./MediaPage";
import LoginPage from './LoginPage';

import "../styles/mainpage.css"
import "../styles/moviecard.css"
import "../styles/loader.css"

export const MainPage = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    return isAuthenticated ? (
        <div className="mainPage">
            <NavBar />
            <div className="page-wrapper">
                <Pages />
            </div>
        </div>
    ) : (
        <LoginPage />
    );
};


const Pages = () => {
    return (
        <Routes>
            <Route path="/" element={<MediaPage key="trading-key" category="trending" />} />
            <Route path="/popular" element={<MediaPage key="popular-key" category="popular" />} />
            <Route path="/discover" element={<DiscoverPage />} />
        </Routes>
    );
}
