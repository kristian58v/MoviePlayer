import React from "react";
import {Link as RouterLink, NavLink } from "react-router-dom";
import movieLogo from '../../styles/images/MovieLogo.png';
import PersonIcon from '@mui/icons-material/Person';
import TrendingIcon from "@mui/icons-material/TrendingUp";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HistoryIcon from '@mui/icons-material/History';
import {useAuth} from "../../context/AuthContext";

const NavBar = () => {

    const { logout, email, firstName, lastName } = useAuth();

    return (
        <div className={"navbar"}>
            <div className={"navContent"}>
                <RouterLink to="/" className="navLogo">
                    <img src={movieLogo} alt="Movie Dashboard"></img>
                </RouterLink>

                <div className={"userDetails"}>
                    <PersonIcon />
                    {firstName} {lastName}
                    {/*<div>{email}</div>*/}
                </div>

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

                    <NavLink to="/history" className={"navLink"}>
                        <HistoryIcon />
                        <div className={"navText"}>History</div>
                    </NavLink>

                </div>

                <div className="logout-wrapper">
                    <button onClick={logout} className="logout-btn">
                        <ExitToAppIcon />
                        <div className={"navText"}>Logout</div>
                    </button>
                </div>

            </div>

        </div>
    )


}

export default NavBar;