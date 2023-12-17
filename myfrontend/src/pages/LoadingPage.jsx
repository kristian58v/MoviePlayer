import React from "react";


export const LoadingPage = () => {

    return (
        <div className="page-wrapper" style={{justifyContent: "center", alignContent: "center", display: "flex"}}>
            <div className="loader-wrapper">
                <div className="custom-loader"></div>
            </div>
        </div>
    )
}