import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export const LogoutAction = () => {
    const { logout } = useAuth();

    return(
        <div className="page-wrapper" style={{display: "flex", flexDirection: "column"}}>
            <h2 className="customTab">
                You are already authenticated.
            </h2>
            <div className="logout-wrapper">
                <button onClick={logout} className="logout-btn">
                    <ExitToAppIcon />
                    <div className={"navText"}>Logout</div>
                </button>
            </div>
        </div>
    )
};
