import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import MovieCard from "../components/MovieCard";
import MoviePlayerModal from "../components/MoviePlayerModal";
import InfiniteScroll from "react-infinite-scroller";
import { useApi } from '../util/useApi';

import { useTranslation } from 'react-i18next';

function MediaPage({ category }) {
    const [activeTab, setActiveTab] = useState(0);
    const [movies, setMovies] = useState([]);
    const [tvSeries, setTvSeries] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreItems, setHasMoreItems] = useState(false);

    const [loading, setLoading] = useState(true);

    const makeRequest = useApi();
    const { i18n } = useTranslation();


    useEffect(() => {
        resetData();

        setLoading(true);

        const fetchDataBasedOnTab = () => {

            if (activeTab === 0) {
                return fetchMovies();
            } else {
                return fetchSeries();
            }
        };

        fetchDataBasedOnTab().finally(() => setLoading(false));
    }, [category, activeTab, i18n.language]);



    const handleChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const resetData = () => {
        setMovies([]);
        setTvSeries([]);
        setCurrentPage(1);
        setHasMoreItems(false);
    };

    const fetchMovies = (page = 1) => {
        const lang = i18n.language;

        let url = category === 'popular'
            ? `/api/${category}/movies/?page=${page}&language=${lang}`
            : `/api/${category}/movies/?language=${lang}`;


        return makeRequest(url)
            .then(response => {
                if (response.error) {
                    console.error('Error fetching movies:', response.message || response.status);
                    // Handle any errors here
                    return;
                }

                const data = response.data;
                if (category === 'popular') {
                    setMovies(movies => [...movies, ...data.results]);
                    setHasMoreItems(page < data.total_pages);
                } else {
                    setMovies(data.results);
                    setHasMoreItems(false);
                }
                setCurrentPage(page);
            });
    };

    const fetchSeries = (page = 1) => {
        const lang = i18n.language;

        let url = category === 'popular'
            ? `/api/${category}/series/?page=${page}&language=${lang}`
            : `/api/${category}/series/?language=${lang}`;

        return makeRequest(url)
            .then(response => {
                if (response.error) {
                    console.error('Error fetching series:', response.message || response.status);
                    // Handle any errors here
                    return;
                }

                const data = response.data;
                if (category === 'popular') {
                    setTvSeries(tvSeries => [...tvSeries, ...data.results]);
                    setHasMoreItems(page < data.total_pages);
                } else {
                    setTvSeries(data.results);
                    setHasMoreItems(false);
                }
                setCurrentPage(page);
            });
    };


    const handleSelectItem = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const renderContent = () => {
        const items = activeTab === 0 ? movies : tvSeries;

        if (!loading && items.length === 0) {
            return <div className={"customTab"}>No items available</div>;
        }

        const loadMore = () => {
            if (category === 'popular') {
                const nextPage = currentPage + 1;
                const fetchFunction = activeTab === 0 ? fetchMovies : fetchSeries;
                fetchFunction(nextPage);
            }
        };


        return (
            <div style={{overflow: "auto"}}>

                <InfiniteScroll
                    pageStart={0}
                    useWindow={false}
                    loadMore={loadMore}
                    hasMore={hasMoreItems}
                    loader={
                        <div key={0} className="loader-wrapper">
                            <div className="custom-loader"></div>
                        </div>
                    }
                >
                    <div className="movieGrid">
                        {items.map(item => (
                            <MovieCard
                                movie={item}
                                key={item.id}
                                onMovieSelect={handleSelectItem}
                            />
                        ))}
                    </div>
                </InfiniteScroll>

            </div>
        );
    };

    // Static Strings
    const { t } = useTranslation();
    const moviesString = t('movies')
    const seriesString = t('series')

    return (
        <div className="page">

            <Box className={"tabs"} sx={{ width: '100%' }}>
                <Tabs className="customTabsContainer" value={activeTab} onChange={handleChange} centered
                      TabIndicatorProps={{
                        style: {
                            backgroundColor: '#FFEB3B',
                            height: '3px',
                            transition: '75ms ease'
                        }
                    }}>
                    <Tab className="customTab" label={moviesString} />
                    <Tab className="customTab" label={seriesString} />
                </Tabs>
            </Box>

            {loading && (
                <div className="loader-wrapper">
                    <div className="custom-loader"></div>
                </div>
            )}

            {!loading && renderContent()}

            {isModalOpen && selectedItem && (
                <MoviePlayerModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    movieId={selectedItem.id}
                    media_type={selectedItem.media_type}
                    title={selectedItem.media_type === 'tv' ? selectedItem.name : selectedItem.title}
                />
            )}

        </div>
    );
}

export default MediaPage;
