import React from 'react';
import { useAuth } from '../context/AuthContext';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useTranslation } from "react-i18next";

export const AlreadyAuthenticatedPage = () => {
    const { logout } = useAuth();

    const { t } = useTranslation();
    const alreadyAuthenticatedString = t('already_authenticated')
    const logoutString = t('logout')

    return(
        <div className="page-wrapper" style={{display: "flex", flexDirection: "column"}}>
            <h2 className="customTab">
                {alreadyAuthenticatedString}
            </h2>
            <div className="logout-wrapper">
                <button onClick={logout} className="logout-btn">
                    <ExitToAppIcon />
                    <div className={"navText"}>{logoutString}</div>
                </button>
            </div>
        </div>
    )
};
