import type { Movie } from '../../models/movie'
import { FavoriteButton } from '../favorites/FavoriteButton'

type MovieCardProps = {
  movie: Movie
  onToggleFavorite: (movieId: string) => void
  onOpenDetails?: (movieId: string) => void
}

import React, { useState } from 'react'

export function MovieCard({ movie, onToggleFavorite, onOpenDetails }: MovieCardProps) {
  const [hasPosterError, setHasPosterError] = useState(false)
  const hasPoster = Boolean(movie.posterUrl) && !hasPosterError

  const handlePosterError = () => {
    setHasPosterError(true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!onOpenDetails) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onOpenDetails(movie.id)
    }
  }

  return (
    <article
      className="movie-card"
      aria-label={movie.title}
      role="button"
      tabIndex={0}
      onClick={() => onOpenDetails?.(movie.id)}
      onKeyDown={handleKeyDown}
    >
      <div
        className={`movie-poster ${hasPoster ? 'has-poster' : ''}`}
        style={!hasPoster ? { background: movie.posterAccent } : undefined}
        aria-label={hasPoster ? `${movie.title} poster` : undefined}
        onClick={(e) => {
          // ensure clicking poster works even if some child overlays exist
          e.stopPropagation()
          onOpenDetails?.(movie.id)
        }}
      >
        {hasPoster ? (
          <img
            src={movie.posterUrl ?? undefined}
            alt={`${movie.title} poster`}
            onError={handlePosterError}
          />
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
            isActive={Boolean(movie.isFavorite)}
            onToggle={(e?: any) => {
              // Prevent the card click handler from also firing when toggling favorite
              if (e && typeof e.stopPropagation === 'function') e.stopPropagation()
              onToggleFavorite(movie.id)
            }}
          />
        </div>
      </div>
    </article>
  )
}
