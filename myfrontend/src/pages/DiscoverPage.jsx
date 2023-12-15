import React, { useState } from 'react';
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import MoviePlayerModal from "../components/MoviePlayerModal";
import { useApi } from '../util/useApi';

function DiscoverPage() {
  const [movies, setMovies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const makeRequest = useApi();

  const fetchMovies = async (query) => {
      const response = await makeRequest(`/api/search/movies/?query=${query}`);

      if (response.error) {
          // Handle errors, e.g., show a message to the user
          console.log('Error fetching movies:', response.message || response.status);
      } else {
          setMovies(response.data.results);
      }
  };

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };


  return (
      <div className={"page"}>
        <SearchBar onSearch={fetchMovies} />
        <div className="movieGrid">
          {movies.map((movie) => (
              (movie.media_type && (movie.media_type === 'movie' || movie.media_type === 'tv')) && (
                  <MovieCard
                      movie={movie}
                      key={movie.id}
                      onMovieSelect={handleMovieSelect}
                  />
              )
          ))}
        </div>

        {isModalOpen && (
            <MoviePlayerModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                movieId={selectedMovie.id}
                media_type={selectedMovie.media_type}
            />
        )}
      </div>
  );
}

export default DiscoverPage;