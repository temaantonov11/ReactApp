import React, { useEffect } from 'react';
import './MovieModal.css';

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
}

interface MovieModalProps {
  movie: MovieDetails;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ movie, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <div className="modal-poster">
            <img
              src={movie.Poster !== 'N/A' ? movie.Poster : '/vite.svg'}
              alt={movie.Title}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/vite.svg';
              }}
            />
          </div>
          <div className="modal-title-section">
            <h2>{movie.Title} ({movie.Year})</h2>
            <div className="modal-ratings">
              {movie.imdbRating !== 'N/A' && (
                <div className="rating imdb-rating">
                  <span className="rating-label">IMDb</span>
                  <span className="rating-value">⭐ {movie.imdbRating}/10</span>
                </div>
              )}
              {movie.Metascore !== 'N/A' && (
                <div className="rating metascore">
                  <span className="rating-label">Metascore</span>
                  <span className="rating-value">{movie.Metascore}/100</span>
                </div>
              )}
            </div>
            <div className="modal-tags">
              <span className="tag">{movie.Rated}</span>
              <span className="tag">{movie.Runtime}</span>
              <span className="tag">{movie.Genre}</span>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="info-grid">
            <div className="info-item">
              <strong>Режиссер:</strong>
              <span>{movie.Director}</span>
            </div>
            <div className="info-item">
              <strong>Сценарист:</strong>
              <span>{movie.Writer}</span>
            </div>
            <div className="info-item">
              <strong>Актеры:</strong>
              <span>{movie.Actors}</span>
            </div>
            <div className="info-item">
              <strong>Страна:</strong>
              <span>{movie.Country}</span>
            </div>
            <div className="info-item">
              <strong>Язык:</strong>
              <span>{movie.Language}</span>
            </div>
            <div className="info-item">
              <strong>Награды:</strong>
              <span>{movie.Awards}</span>
            </div>
          </div>

          <div className="plot-section">
            <h3>Сюжет</h3>
            <p>{movie.Plot}</p>
          </div>

          {movie.Ratings && movie.Ratings.length > 0 && (
            <div className="ratings-section">
              <h3>Рейтинги</h3>
              <div className="ratings-list">
                {movie.Ratings.map((rating, index) => (
                  <div key={index} className="rating-item">
                    <span className="rating-source">{rating.Source}:</span>
                    <span className="rating-value">{rating.Value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieModal;