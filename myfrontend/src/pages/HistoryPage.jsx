import React, {useEffect, useState} from 'react';
import MovieCard from "../components/MovieCard";
import MoviePlayerModal from "../components/MoviePlayerModal";
import InfiniteScroll from "react-infinite-scroller";
import { useApi } from '../util/useApi';
import {debounce} from "@mui/material";

function HistoryPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);

    const [movieCategories, setMovieCategories] = useState({ today: [], yesterday: [], others: {} });

    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreItems, setHasMoreItems] = useState(true)

    const makeRequest = useApi();

    const fetchHistory = async (page) => {
        const response = await makeRequest(`/api/get_watched_items?page=${page}`);
        if (response.error) {
            console.log('Error fetching watch history:', response.message || response.status);
        } else {
            if (response.data.results.length === 0) {
                setHasMoreItems(false);
                return;
            }

            const newMovies = categorizeMovies(response.data.results);
            setMovieCategories(currentCategories => {
                if (page === 1) {
                    return newMovies;
                } else {
                    // Safely merge newMovies with existing movieCategories
                    const mergedCategories = {
                        today: [...(currentCategories.today || []), ...(newMovies.today || [])],
                        yesterday: [...(currentCategories.yesterday || []), ...(newMovies.yesterday || [])],
                        others: { ...(currentCategories.others || {}) }
                    };

                    // Merge others category
                    Object.entries(newMovies.others || {}).forEach(([date, movies]) => {
                        if (mergedCategories.others[date]) {
                            mergedCategories.others[date] = [...mergedCategories.others[date], ...movies];
                        } else {
                            mergedCategories.others[date] = movies;
                        }
                    });

                    return mergedCategories;
                }
            });
            setCurrentPage(page);
        }
    };


    useEffect(() => {
        fetchHistory(1); // Fetch first page on component mount
    }, []);

    const handleMovieSelect = (movie) => {
        setSelectedMovie(movie);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMovie(null);
        fetchHistory()
    };

    const categorizeMovies = (movies) => {
        const categories = {
            today: [],
            yesterday: [],
            others: {}
        };

        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        movies.forEach(movie => {
            const watchedDate = new Date(movie.watched_on);
            if (watchedDate.toDateString() === today.toDateString()) {
                categories.today.push(movie);
            } else if (watchedDate.toDateString() === yesterday.toDateString()) {
                categories.yesterday.push(movie);
            } else {
                const dateKey = watchedDate.toDateString();
                if (!categories.others[dateKey]) {
                    categories.others[dateKey] = [];
                }
                categories.others[dateKey].push(movie);
            }
        });
        return categories;
    };

    const loadMore = debounce(() => {
        fetchHistory(currentPage + 1);
    }, 1000); // Adjust the debounce time as needed

    return (
        <div className={"page"}>
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
                        {movieCategories.today.length > 0 && (
                            <>
                                <div className={"customTab fullWidth"}>
                                    <h2>Today</h2>
                                </div>
                                {movieCategories.today.map(movie => (
                                    <MovieCard
                                        movie={movie}
                                        key={movie.id}
                                        onMovieSelect={handleMovieSelect} />
                                ))}
                            </>
                        )}

                        {movieCategories.yesterday.length > 0 && (
                            <>
                                <div className={"customTab fullWidth"}>
                                    <h2>Yesterday</h2>
                                </div>

                                {movieCategories.yesterday.map(movie => (
                                    <MovieCard
                                        movie={movie}
                                        key={movie.id}
                                        onMovieSelect={handleMovieSelect} />
                                ))}
                            </>
                        )}

                        {Object.entries(movieCategories.others).map(([date, movies]) => (
                            <React.Fragment key={date}>
                                <div className={"customTab fullWidth"}>
                                    <h2>{date}</h2>
                                </div>
                                {movies.map(movie => (
                                    <MovieCard
                                        movie={movie}
                                        key={movie.id}
                                        onMovieSelect={handleMovieSelect} />
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </InfiniteScroll>

                {isModalOpen && (
                    <MoviePlayerModal
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        movieId={selectedMovie.movie_series_id}
                        media_type={selectedMovie.media_type}
                        title={selectedMovie.media_type === 'tv' ? selectedMovie.name : selectedMovie.title}
                    />
                )}
            </div>
        </div>
    );
}

export default HistoryPage;