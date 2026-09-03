import React, { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useFavorites } from '../../hooks/useFavorites'
import { fetchMovieDetailsById } from '../../services/omdbService'
import { FavoriteButton } from './FavoriteButton'

type Detail = {
  imdbID: string
  Title?: string
  Year?: string
  Genre?: string
  Plot?: string
  imdbRating?: string
  Poster?: string
}

export function FavoritesList() {
  const { currentUser } = useAuth()
  const { favoriteIds, isLoading, error, toggleFavorite } = useFavorites()
  const [details, setDetails] = useState<Record<string, Detail | null>>({})
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [detailsError, setDetailsError] = useState<string | null>(null)

  useEffect(() => {
    const ids = Array.from(favoriteIds)
    if (ids.length === 0) {
      setDetails({})
      return
    }

    let cancelled = false
    setLoadingDetails(true)
    setDetailsError(null)

    ;(async () => {
      try {
        const results = await Promise.all(
          ids.map(async (id) => {
            try {
              const payload = await fetchMovieDetailsById(id)
              return { id, payload }
            } catch (err) {
              return { id, payload: null }
            }
          }),
        )

        if (cancelled) return

        const map: Record<string, Detail | null> = {}
        for (const r of results) {
          if (r.payload) {
            map[r.id] = {
              imdbID: r.payload.imdbID,
              Title: r.payload.Title,
              Year: r.payload.Year,
              Genre: r.payload.Genre,
              Plot: r.payload.Plot,
              imdbRating: r.payload.imdbRating,
              Poster: r.payload.Poster,
            }
          } else {
            map[r.id] = null
          }
        }

        setDetails(map)
      } catch (err) {
        setDetailsError(err instanceof Error ? err.message : 'Failed to load favorite details')
      } finally {
        setLoadingDetails(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [favoriteIds])

  if (!currentUser) {
    return (
      <div className="state-panel empty-panel" aria-live="polite">
        <h3>Sign in to view your favorites</h3>
        <p>Favorites are saved to your account. Please sign in to see your saved movies.</p>
      </div>
    )
  }

  if (isLoading || loadingDetails) {
    return (
      <div className="state-panel" aria-live="polite">
        <div className="spinner" aria-hidden="true" />
        <p>Loading your favorites…</p>
      </div>
    )
  }

  if (error || detailsError) {
    return (
      <div className="state-panel error-panel" aria-live="assertive">
        <h3>Could not load favorites</h3>
        <p>{error ?? detailsError ?? 'An unexpected error occurred.'}</p>
      </div>
    )
  }

  const ids = Array.from(favoriteIds)
  if (ids.length === 0) {
    return (
      <div className="state-panel empty-panel">
        <h3>No saved movies yet</h3>
        <p>Save a movie to your favorites and it will appear here.</p>
      </div>
    )
  }

  return (
    <div className="movie-grid" role="list" aria-label="Favorite movies">
      {ids.map((id) => {
        const d = details[id]
        const title = d?.Title ?? 'Unknown'
        const year = d?.Year ?? 'N/A'
        const genre = d?.Genre ? d.Genre.split(',')[0].trim() : 'Movie'
        const rating = d?.imdbRating ?? 'N/A'
        const posterUrl = d?.Poster && d.Poster !== 'N/A' ? d.Poster : null

        const movie = {
          id,
          title,
          year,
          genre,
          rating,
          description: d?.Plot ?? 'No synopsis available from OMDb.',
          posterUrl,
          posterAccent: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
          isFavorite: true,
        }

        return (
          <div key={id} role="listitem">
            <article className="movie-card" aria-label={movie.title}>
              <div
                className={`movie-poster ${movie.posterUrl ? 'has-poster' : ''}`}
                style={!movie.posterUrl ? { background: movie.posterAccent } : undefined}
                aria-label={movie.posterUrl ? `${movie.title} poster` : undefined}
              >
                {movie.posterUrl ? (
                  <img src={movie.posterUrl} alt={`${movie.title} poster`} />
                ) : (
                  <span>{movie.title}</span>
                )}
              </div>

              <div className="movie-info">
                <div className="movie-header-row">
                  <div>
                    <h3>{movie.title}</h3>
                    <p className="movie-meta-line">
                      <span>{movie.year}</span>
                      <span>•</span>
                      <span>{movie.genre}</span>
                    </p>
                  </div>

                  <span className="movie-rating">{movie.rating}</span>
                </div>

                <p className="movie-description">{movie.description}</p>

                <div className="movie-actions">
                  <FavoriteButton
                    isActive={true}
                    onToggle={async (e?: any) => {
                      if (e && typeof e.stopPropagation === 'function') e.stopPropagation()
                      try {
                        await toggleFavorite(id)
                      } catch (err) {
                        alert(err instanceof Error ? err.message : 'Could not update favorite')
                      }
                    }}
                  />
                </div>
              </div>
            </article>
          </div>
        )
      })}
    </div>
  )
}
