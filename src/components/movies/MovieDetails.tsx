import type { MovieDetail } from '../../models/movieDetail'

type MovieDetailsProps = {
  isOpen: boolean
  movie: MovieDetail | null
  isLoading: boolean
  error: string | null
  onClose: () => void
}

export function MovieDetails({ isOpen, movie, isLoading, error, onClose }: MovieDetailsProps) {
  if (!isOpen) return null

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-panel">
        <button className="modal-close" onClick={onClose} aria-label="Close movie details">
          ← Back
        </button>

        {isLoading && (
          <div className="state-panel" aria-live="polite">
            <div className="spinner" aria-hidden="true" />
            <p>Loading details…</p>
          </div>
        )}

        {error && (
          <div className="state-panel error-panel" aria-live="assertive">
            <h3>Could not load movie details</h3>
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && movie && (
          <div className="movie-details">
            <div className="movie-details-poster" style={movie.posterUrl ? undefined : { background: movie.posterAccent }}>
              {movie.posterUrl ? (
                <img src={movie.posterUrl} alt={`${movie.title} poster`} />
              ) : (
                <span>{movie.title}</span>
              )}
            </div>

            <div className="movie-details-info">
              <h2>{movie.title}</h2>
              <p className="movie-meta-line">
                <span>{movie.year}</span>
                {movie.genre && (
                  <>
                    <span>•</span>
                    <span>{movie.genre}</span>
                  </>
                )}
                {movie.runtime && (
                  <>
                    <span>•</span>
                    <span>{movie.runtime}</span>
                  </>
                )}
              </p>

              {movie.imdbRating && (
                <p>
                  <strong>IMDb:</strong> {movie.imdbRating}
                </p>
              )}

              {movie.plot && <p className="movie-description">{movie.plot}</p>}

              {movie.director && (
                <p>
                  <strong>Director:</strong> {movie.director}
                </p>
              )}

              {movie.actors && (
                <p>
                  <strong>Actors:</strong> {movie.actors}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
