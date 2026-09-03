import { useCallback, useEffect, useState } from 'react'
import type { MovieDetail } from '../models/movieDetail'
import { fetchMovieDetailsById } from '../services/omdbService'

export function useMovieDetails() {
  const [isOpen, setIsOpen] = useState(false)
  const [movieId, setMovieId] = useState<string | null>(null)
  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const open = useCallback((id: string) => {
    setMovieId(id)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setMovieId(null)
    setMovie(null)
    setError(null)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isOpen || !movieId) {
      return
    }

    let cancelled = false

    const load = async () => {
      setIsLoading(true)
      setError(null)
      setMovie(null)

      try {
        const payload = await fetchMovieDetailsById(movieId)

        if (cancelled) return

        const detail: MovieDetail = {
          id: payload.imdbID,
          title: payload.Title,
          year: payload.Year,
          genre: payload.Genre,
          runtime: payload.Runtime,
          imdbRating: payload.imdbRating,
          plot: payload.Plot && payload.Plot !== 'N/A' ? payload.Plot : undefined,
          director: payload.Director,
          actors: payload.Actors,
          posterUrl: payload.Poster && payload.Poster !== 'N/A' ? payload.Poster : null,
          posterAccent: undefined,
        }

        setMovie(detail)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load movie details')
      } finally {
        setIsLoading(false)
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [isOpen, movieId])

  return {
    isOpen,
    movie,
    isLoading,
    error,
    open,
    close,
  }
}
