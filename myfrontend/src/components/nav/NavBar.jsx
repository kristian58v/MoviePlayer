import React from "react";
import {Link as RouterLink, NavLink } from "react-router-dom";
import movieLogo from '../../styles/images/MovieLogo.png';
import TrendingIcon from "@mui/icons-material/TrendingUp";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const NavBar = () => {

    const handleLogout = () => {
        // Implement logout logic here
        // e.g., remove token from localStorage, update auth context
        localStorage.removeItem('authToken');
        // If using auth context to manage authentication state
        // setAuthenticated(false);
        window.location.reload()
    };

    return (
        <div className={"navbar"}>
            <div className={"navContent"}>
                <RouterLink to="/" className="navLogo">
                    <img src={movieLogo} alt="Movie Dashboard"></img>
                </RouterLink>

                <div className="navTabs">

                    <NavLink to="/" className={"navLink"}>
                        <TrendingIcon />
                        <div className={"navText"}>Trending</div>
                    </NavLink>

                    <NavLink to="/popular" className={"navLink"}>
                        <StarIcon />
                        <div className={"navText"}>Popular</div>
                    </NavLink>

                    <NavLink to="/discover" className={"navLink"}>
                        <SearchIcon />
                        <div className={"navText"}>Discover</div>
                    </NavLink>

                </div>

                <div className="logout-wrapper">
                    <button onClick={handleLogout} className="logout-btn">
                        <ExitToAppIcon />
                        <div className={"navText"}>Logout</div>
                    </button>
                </div>

            </div>

        </div>
    )


}

export default NavBar;