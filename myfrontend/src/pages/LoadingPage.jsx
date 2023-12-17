import React from "react";


export const LoadingPage = () => {

    return (
        <div className="page-wrapper" style={{display: "flex", justifyContent: "center", alignContent: "center"}}>
            <div className="loader-wrapper">
                <div className="custom-loader"></div>
            </div>
        </div>
    )
}