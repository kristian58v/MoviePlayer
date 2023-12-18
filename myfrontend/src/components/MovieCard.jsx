import React from 'react';
import default_poster from '../styles/images/default_poster.png';
import { Rating } from "@mui/material";
import { useTranslation } from "react-i18next";

function MovieCard({ movie, onMovieSelect }) {
    const { poster_path, media_type, overview, vote_average, vote_count, name, title, first_air_date, release_date } = movie;

    const { genre_names } = movie;

    const imageUrl = poster_path
        ? `https://image.tmdb.org/t/p/w400${poster_path}`
        : default_poster;

    // Static Strings
    const { t } = useTranslation();
    const firstAirDateString = t('first_air_date')
    const releaseDateString = t('first_air_date')
    const votesString = t('votes')

    const getDisplayDetails = () => {
        const displayTitle = media_type === 'tv' ? name : title;
        const dateLabel = media_type === 'tv' ? firstAirDateString : releaseDateString;
        const releaseDate = (media_type === 'tv' ? first_air_date : release_date)

        return { displayTitle, dateLabel, releaseDate };
    };

    const { displayTitle, dateLabel, releaseDate } = getDisplayDetails();


    return (
        <div className="movieCard" onClick={() => onMovieSelect(movie)}>

            <div className="imageContainer">
                <img src={imageUrl} alt={displayTitle} className="movieImage" />
                <div className="movieOverview">{overview}</div>
            </div>

            <div className="movieContent">
                <h2 className="movieTitle">{displayTitle}</h2>

                <div className="movieGenres">
                    {genre_names && genre_names.map((genre, index) => (
                        <span key={index} className="genreBox">{genre}</span>
                    ))}
                </div>

                <div className="movieInfo">
                    <span className="movieReleaseDate">
                        <div>{dateLabel}:</div>
                        <div>{releaseDate}</div>
                    </span>
                    <span className="movieRating">
                        <Rating name="size-small" readOnly defaultValue={vote_average/2} size="small" precision={0.1}/>
                        <div>{(vote_average/2).toFixed(2)} ({vote_count} {votesString})</div>
                    </span>
                </div>
            </div>

        </div>
    );
}

export default MovieCard;
