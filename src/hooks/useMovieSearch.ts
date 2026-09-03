import { useEffect, useRef, useState } from 'react'
import type { Movie } from '../models/movie'
import {
  QueryTooBroadError,
  SearchApiError,
  loadInitialDiscoveryMovies,
  searchMovies,
} from '../services/omdbService'

export type SearchStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'empty'
  | 'validation'
  | 'too-broad'
  | 'error'

export function useMovieSearch() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<SearchStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const hasLoadedInitialMovies = useRef(false)

  useEffect(() => {
    if (hasLoadedInitialMovies.current) {
      return
    }

    hasLoadedInitialMovies.current = true

    const loadInitialMovies = async () => {
      setIsLoading(true)
      setStatus('loading')
      setError(null)

      try {
        const initialMovies = await loadInitialDiscoveryMovies()
        setMovies(initialMovies)
        setStatus('success')
      } catch (caughtError) {
        setMovies([])
        setStatus('error')
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'We could not load the discovery picks. Please try again later.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    void loadInitialMovies()
  }, [])

  const handleSearch = async (requestedPage = 1) => {
    const normalized = query.trim()

    if (!normalized) {
      setMovies([])
      setPage(1)
      setStatus('validation')
      setError('Please enter a movie title or keyword before searching.')
      return
    }

    setIsLoading(true)
    setStatus('loading')
    setError(null)
    setPage(requestedPage)

    try {
      const results = await searchMovies(normalized, requestedPage)
      setMovies(results)

      if (results.length === 0) {
        setStatus('empty')
        setError(null)
      } else {
        setStatus('success')
        setError(null)
      }
    } catch (caughtError) {
      setMovies([])

      if (caughtError instanceof QueryTooBroadError) {
        setStatus('too-broad')
        setError(caughtError.message)
        return
      }

      setStatus('error')
      setError(
        caughtError instanceof SearchApiError
          ? caughtError.message
          : 'The movie search could not be completed. Please try again later.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFavorite = (movieId: string) => {
    setMovies((currentMovies) => {
      return currentMovies.map((movie) => {
        if (movie.id !== movieId) {
          return movie
        }

        return {
          ...movie,
          isFavorite: !movie.isFavorite,
        }
      })
    })
  }

  return {
    query,
    setQuery,
    movies,
    isLoading,
    status,
    page,
    error,
    handleSearch,
    toggleFavorite,
  }
}
