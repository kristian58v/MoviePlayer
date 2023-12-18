import React from "react";
import {useTranslation} from "react-i18next";

export const NotFoundPage = () => {

    const { t } = useTranslation();
    const nonExistingPageString = t('non_existing_page')

    return (
        <div className="page-wrapper" style={{display: "flex", flexDirection: "column"}}>
            <h1 className="customTab">
                404
            </h1>
            <h2 className="customTab">
                {nonExistingPageString}
            </h2>
        </div>
    )
}
