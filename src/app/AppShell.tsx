import { Header } from '../components/layout/Header'
import { SearchBar } from '../components/movies/SearchBar'
import { MovieGrid } from '../components/movies/MovieGrid'
import { useMovieSearch } from '../hooks/useMovieSearch'
import { useMovieDetails } from '../hooks/useMovieDetails'
import { MovieDetails } from '../components/movies/MovieDetails'

export function AppShell() {
  const { query, setQuery, movies, isLoading, status, error, handleSearch, toggleFavorite } = useMovieSearch()
  const { isOpen, movie, isLoading: isDetailsLoading, error: detailsError, open, close } = useMovieDetails()

  return (
    <div className="app-shell" id="home">
      <Header />

      <main className="page-shell">
        <section className="hero-panel">
          <div className="hero-copy">
            <p className="eyebrow">Explore the latest stories</p>
            <h1>Find your next favorite movie.</h1>
            <p className="hero-text">
              Browse curated picks, discover new genres, and save the ones you want to revisit later.
            </p>
          </div>

          <div className="search-panel">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={handleSearch}
              isLoading={isLoading}
            />

            <div className="summary-row" aria-live="polite">
              <span>{movies.length} results</span>
              <span>{movies.filter((movie) => movie.isFavorite).length} saved</span>
            </div>
          </div>
        </section>

        <section className="results-panel" id="discover" aria-label="Movie search results section">
          <div className="results-header">
            <div>
              <p className="eyebrow">Curated picks</p>
              <h2>Movie discovery</h2>
            </div>
            <span className="results-tag">Curated for tonight</span>
          </div>

          <MovieGrid
            movies={movies}
            isLoading={isLoading}
            status={status}
            error={error}
            onToggleFavorite={toggleFavorite}
            onOpenDetails={open}
          />
        </section>

        <MovieDetails isOpen={isOpen} movie={movie} isLoading={isDetailsLoading} error={detailsError} onClose={close} />
      </main>
    </div>
  )
}
