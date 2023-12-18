import React from "react";
import { renderToStaticMarkup } from 'react-dom/server';
import { Link as RouterLink, NavLink } from "react-router-dom";

import { styled } from '@mui/material/styles';
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

import {useTranslation} from "react-i18next";

import { ReactComponent as BulgarianFlagIcon } from '../../styles/images/bulgaria-flag-round-circle-icon.svg';
import { ReactComponent as EnglishFlagIcon } from '../../styles/images/uk-flag-round-circle-icon.svg';

const NavBar = () => {

    const { logout, email, firstName, lastName } = useAuth();

    const { player, togglePlayer } = usePlayer();

    // Determine if the switch should be checked (Player 2 is the "checked" state)
    const isPlayerTwo = player === "Player 2";


    const { t, i18n } = useTranslation();
    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'bg' : 'en';
        i18n.changeLanguage(newLang);
    };

    const isBulgarian = i18n.language === 'bg';

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

                <div className="language-switch">
                    <LanguageSwitch
                        checked={isBulgarian}
                        onChange={toggleLanguage}
                    />
                </div>

                <div className="navTabs">

                    <NavLink to="/" className={"navLink"}>
                        <TrendingIcon />
                        <div className={"navText"}>{t('trending')}</div>
                    </NavLink>

                    <NavLink to="/popular" className={"navLink"}>
                        <StarIcon />
                        <div className={"navText"}>{t('popular')}</div>
                    </NavLink>

                    <NavLink to="/discover" className={"navLink"}>
                        <SearchIcon />
                        <div className={"navText"}>{t('discover')}</div>
                    </NavLink>

                    <NavLink to="/history" className={"navLink"}>
                        <HistoryIcon />
                        <div className={"navText"}>{t('history')}</div>
                    </NavLink>

                    <div className="player-switch-wrapper">
                        <div className={"player-label"}>
                            <div className={"navText"}> {t('video_player')}</div>
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
                        <div className={"navText"}>{t('logout')}</div>
                    </button>
                </div>

            </div>

        </div>
    )

}

export default NavBar;

const LanguageSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        '&.Mui-checked': {
            transform: 'translateX(35px)',
            '& + .MuiSwitch-track': {
                backgroundColor: '#aab4be',
            },
            '& .MuiSwitch-thumb': {
                // SVG for Bulgarian flag (replace with your icon)
                backgroundImage: convertSvg(<BulgarianFlagIcon />),
            },
        },
    },
    '& .MuiSwitch-thumb': {
        // SVG for English flag (replace with your icon)
        backgroundImage: convertSvg(<EnglishFlagIcon />),
        backgroundColor: '#fff',
        transform: 'translateY(8px)',
    },
    '& .MuiSwitch-track': {
        backgroundColor: '#aab4be',
        borderRadius: 20 / 2,
    },
}));

const convertSvg = (svgElement) => {
    const markup = renderToStaticMarkup(svgElement);
    const encoded = encodeURIComponent(markup);
    const dataUri = `url('data:image/svg+xml;utf8,${encoded}')`;
    return dataUri;
};