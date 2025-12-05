import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard/MovieCard';
import MovieModal from '../components/MovieModal/MovieModal';
import './movie.css';

// Интерфейсы для типизации
interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

interface MovieDetails {
  imdbID: string;
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: { Source: string; Value: string }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  Type: string;
  Response: string;
}

// Главный компонент страницы фильмов
const MoviePage: React.FC = () => {
  const API_KEY = 'd9cf6dd5';

  // Состояния компонента
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);

  // API ФУНКЦИИ
  const searchMovies = async (query: string) => {
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching movies:', error);
      return { Response: 'False', Error: 'Network error' };
    }
  };

  const getMovieDetails = async (imdbID: string) => {
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return { Response: 'False', Error: 'Network error' };
    }
  };

  // Обработчик поиска
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError('Введите название фильма');
      return;
    }

    setLoading(true);
    setError('');
    setSearchPerformed(true);

    try {
      const result = await searchMovies(searchQuery);
      
      if (result.Response === 'True') {
        setMovies(result.Search);
      } else {
        setMovies([]);
        setError(result.Error || 'Фильмы не найдены');
      }
    } catch (err) {
      setError('Ошибка при поиске фильмов');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Обработчик клика по кнопке "Подробнее"
  const handleDetailsClick = async (imdbID: string) => {
    try {
      const movieDetails = await getMovieDetails(imdbID);
      if (movieDetails.Response === 'True') {
        setSelectedMovie(movieDetails);
      } else {
        setError('Не удалось загрузить детали фильма');
      }
    } catch (err) {
      setError('Ошибка при загрузке деталей фильма');
      console.error(err);
    }
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  // Автопоиск популярных фильмов при первой загрузке
  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const result = await searchMovies('movie');
        if (result.Response === 'True') {
          setMovies(result.Search.slice(0, 6));
        }
      } catch (err) {
        console.error('Error fetching popular movies:', err);
      }
    };

    fetchPopularMovies();
  }, []);

  return (
    <div className="movie-page">
      <div className="movie-container">
        <h1 className="page-title">🎬 Поиск фильмов</h1>
        
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Введите название фильма..."
              className="search-input"
              disabled={loading}
            />
            <button 
              type="submit" 
              className="search-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Поиск...
                </>
              ) : 'Найти'}
            </button>
          </div>
          <div className="search-hint">
            Например: "Harry Potter", "The Lord of the Rings", "Inception"
          </div>
        </form>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {loading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Ищем фильмы...</p>
          </div>
        )}

        {!loading && movies.length > 0 && (
          <>
            <div className="results-header">
              <h2>Найдено фильмов: {movies.length}</h2>
              {searchPerformed && (
                <button 
                  className="clear-button"
                  onClick={() => {
                    setMovies([]);
                    setSearchQuery('');
                    setSearchPerformed(false);
                  }}
                >
                  Очистить результаты
                </button>
              )}
            </div>
            <div className="movies-grid">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.imdbID}
                  movie={movie}
                  onDetailsClick={handleDetailsClick}
                />
              ))}
            </div>
          </>
        )}

        {!loading && movies.length === 0 && searchPerformed && !error && (
          <div className="no-results">
            <p>😕 Фильмы не найдены</p>
            <p>Попробуйте изменить запрос</p>
          </div>
        )}

        {!loading && movies.length === 0 && !searchPerformed && !error && (
          <div className="welcome-message">
            <h2>Добро пожаловать!</h2>
            <p>Введите название фильма в поиске или посмотрите популярные фильмы</p>
          </div>
        )}
      </div>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default MoviePage;