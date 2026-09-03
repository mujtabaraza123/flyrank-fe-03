import type { Movie } from '../../models/movie'
import type { SearchStatus } from '../../hooks/useMovieSearch'
import { MovieCard } from './MovieCard'

type MovieGridProps = {
  movies: Movie[]
  isLoading: boolean
  status: SearchStatus
  error: string | null
  onToggleFavorite: (movieId: string) => void
  onOpenDetails?: (movieId: string) => void
}

export function MovieGrid({ movies, isLoading, status, error, onToggleFavorite, onOpenDetails }: MovieGridProps) {
  if (isLoading) {
    return (
      <div className="state-panel" aria-live="polite">
        <div className="spinner" aria-hidden="true" />
        <p>Loading movie picks…</p>
      </div>
    )
  }

  if (status === 'validation') {
    return (
      <div className="state-panel error-panel" aria-live="assertive">
        <h3>Search needs a clearer query</h3>
        <p>{error ?? 'Please enter a movie title or keyword before searching.'}</p>
      </div>
    )
  }

  if (status === 'too-broad') {
    return (
      <div className="state-panel error-panel" aria-live="assertive">
        <h3>Try a more specific search</h3>
        <p>{error ?? 'That search is too broad. Please enter a more specific title or keyword.'}</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="state-panel error-panel" aria-live="assertive">
        <h3>Something went wrong</h3>
        <p>{error ?? 'The movie search could not be completed. Please try again later.'}</p>
      </div>
    )
  }

  if (status === 'empty' || movies.length === 0) {
    return (
      <div className="state-panel empty-panel">
        <h3>No movies match that search</h3>
        <p>Try another title or keyword and check your spelling.</p>
      </div>
    )
  }

  return (
    <div className="movie-grid" role="list" aria-label="Movie results">
      {movies.map((movie) => (
        <div key={movie.id} role="listitem">
          <MovieCard movie={movie} onToggleFavorite={onToggleFavorite} onOpenDetails={onOpenDetails} />
        </div>
      ))}
    </div>
  )
}
