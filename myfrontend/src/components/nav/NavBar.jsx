import React from "react";
import { Link as RouterLink, NavLink } from "react-router-dom";

import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';


import movieLogo from '../../styles/images/MovieLogo.png';
import PersonIcon from '@mui/icons-material/Person';
import TrendingIcon from "@mui/icons-material/TrendingUp";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import HistoryIcon from '@mui/icons-material/History';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import { useAuth}  from "../../context/AuthContext";
import { usePlayer } from "../../context/PlayerContext";

import vidsrcLogo from '../../styles/images/vidsrcplayer.png';
import xyzLogo from '../../styles/images/xyzplayer.svg';

const NavBar = () => {

    const { logout, email, firstName, lastName } = useAuth();

    const { player, togglePlayer } = usePlayer();

    // Determine if the switch should be checked (Player 2 is the "checked" state)
    const isPlayerTwo = player === "Player 2";

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

                    <div className="player-switch-wrapper">
                        <div className={"player-label"}>
                            <div className={"navText"}> Player</div>
                            <SlideshowIcon />
                        </div>

                        <FormControlLabel
                            className={"player-switch"}
                            control={
                                <Switch
                                    checked={isPlayerTwo}
                                    onChange={togglePlayer}
                                    color="primary"
                                    sx={{
                                        '& .MuiSwitch-thumb': {
                                            color: isPlayerTwo ? 'default' : '#f9cb71', // Unchecked color
                                        },
                                        '& .MuiSwitch-track': {
                                            backgroundColor: isPlayerTwo ? 'default' : '#f3d392', // Unchecked track color
                                        }
                                    }}
                                />
                            }
                            label={isPlayerTwo ? <img src={xyzLogo} alt="Player 2" />
                                : <img src={vidsrcLogo} alt="Player 1" />}
                        />
                    </div>

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