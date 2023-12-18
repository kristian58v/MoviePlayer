import React, { useState } from 'react';
import {useTranslation} from "react-i18next";

function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        onSearch(query);
    };

    const { t } = useTranslation();
    const SearchLabelString = t('search_label')
    const SearchString = t('search')

    return (
        <div className="searchBar">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={SearchLabelString}
            />
            <button onClick={handleSearch}>{SearchString}</button>
        </div>
    );
}

export default SearchBar;
