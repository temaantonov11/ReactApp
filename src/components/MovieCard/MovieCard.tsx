import React from 'react';
import './MovieCard.css';

interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

interface MovieCardProps {
  movie: Movie;
  onDetailsClick: (imdbID: string) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onDetailsClick }) => {
  const handleClick = () => {
    onDetailsClick(movie.imdbID);
  };

  return (
    <div className="movie-card">
      <div className="movie-poster-container">
        <img
          src={movie.Poster !== 'N/A' ? movie.Poster : '/vite.svg'}
          alt={movie.Title}
          className="movie-poster"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/vite.svg';
          }}
        />
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.Title}</h3>
        <div className="movie-meta">
          <span className="movie-year">📅 {movie.Year}</span>
          <span className="movie-type">
            {movie.Type === 'movie' ? '🎬 Фильм' : 
             movie.Type === 'series' ? '📺 Сериал' : '📝 ' + movie.Type}
          </span>
        </div>
        <button 
          className="details-btn"
          onClick={handleClick}
        >
          Подробнее
        </button>
      </div>
    </div>
  );
};

export default MovieCard;