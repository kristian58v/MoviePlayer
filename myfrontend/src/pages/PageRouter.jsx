// src/pages/MainPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NavBar from "../components/nav/NavBar";
import { Routes, Route } from "react-router-dom";
import DiscoverPage from "./DiscoverPage";
import MediaPage from "./MediaPage";
import HistoryPage from "./HistoryPage";
import LoginPage from './LoginPage';

import "../styles/mainpage.css"
import "../styles/moviecard.css"
import "../styles/loader.css"

import {LoadingPage} from "./LoadingPage";
import {NotFoundPage} from "./NotFoundPage";
import {AlreadyAuthenticatedPage} from "./AlreadyAuthenticatedPage";

export const PageRouter = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    React.useEffect(() => {
        // Redirect only if isAuthenticated is explicitly false
        if (isAuthenticated === false) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);


    if (isAuthenticated === null) {
        return <LoadingPage />
    }

    return isAuthenticated ? (
        <div className="mainPage">
            <NavBar />
            <div className="page-wrapper">
                <AuthenticatedPages />
            </div>
        </div>
    ) : (
        <LoginPage />
    );
};

const AuthenticatedPages = () => {

    return (
        <Routes>
            <Route path="/" element={<MediaPage key="trading-key" category="trending" />} />
            <Route path="/popular" element={<MediaPage key="popular-key" category="popular" />} />
            <Route path="/discover" element={<DiscoverPage />} />

            <Route path="/history" element={<HistoryPage />} />

            <Route path="/login" element={<AlreadyAuthenticatedPage />} />

            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
