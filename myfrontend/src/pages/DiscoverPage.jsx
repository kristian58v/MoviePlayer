import React, {useEffect, useState} from 'react';
import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import MoviePlayerModal from "../components/MoviePlayerModal";
import { useApi } from '../util/useApi';
import { useTranslation } from 'react-i18next';


function DiscoverPage() {
    const [movies, setMovies] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);

    const [loading, setLoading] = useState(false);
    const [searchExecuted, setSearchExecuted] = useState(false); // New state

    const [lastQuery, setLastQuery] = useState(null)

    const makeRequest = useApi();
    const { i18n } = useTranslation();

    useEffect(() => {
        if (searchExecuted) {
            fetchMovies(lastQuery);
        }
    }, [i18n.language]); // Depend on the current language


    const fetchMovies = async (query) => {
        setLoading(true);
        setMovies([]);

        const lang = i18n.language;

        const response = await makeRequest(`/api/search/movies/?query=${query}&language=${lang}`);

        if (response.error) {
            // Handle errors, e.g., show a message to the user
            console.log('Error fetching movies:', response.message || response.status);
        } else {
            setLastQuery(query)
            setMovies(response.data.results);
        }

        setLoading(false);
        setSearchExecuted(true);
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

          {loading && (
              <div className="loader-wrapper">
                  <div className="custom-loader"></div>
              </div>
          )}

          <div className="movieGrid">
              {searchExecuted && movies.length === 0 && !loading ? (
                  <div className="customTab">No results found</div>
              ) : (
                  movies.map((movie) => (
                      movie.media_type && (movie.media_type === 'movie' || movie.media_type === 'tv') && (
                          <MovieCard
                              movie={movie}
                              key={movie.id}
                              onMovieSelect={handleMovieSelect}
                          />
                      )
                  ))
              )}
          </div>

          {isModalOpen && (
              <MoviePlayerModal
                  isOpen={isModalOpen}
                  onClose={handleCloseModal}
                  movieId={selectedMovie.id}
                  media_type={selectedMovie.media_type}
                  title={selectedMovie.media_type === 'tv' ? selectedMovie.name : selectedMovie.title}
              />
          )}
      </div>
  );
}

export default DiscoverPage;