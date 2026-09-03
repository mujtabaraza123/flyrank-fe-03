import { useCallback, useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import {
  addFavoriteForUser,
  removeFavoriteForUser,
  listFavoriteIdsForUser,
} from '../services/favoritesService'

export function useFavorites() {
  const { currentUser } = useAuth()
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadFavorites = useCallback(async (uid: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const ids = await listFavoriteIdsForUser(uid)
      setFavoriteIds(new Set(ids))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load favorites')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      void loadFavorites(currentUser.uid)
    } else {
      // clear for unauthenticated users
      setFavoriteIds(new Set())
    }
  }, [currentUser, loadFavorites])

  const isFavorite = useCallback(
    (movieId: string) => {
      return favoriteIds.has(movieId)
    },
    [favoriteIds],
  )

  const addFavorite = useCallback(
    async (movieId: string) => {
      if (!currentUser || !currentUser.uid) {
        throw new Error('Authentication required to save favorites')
      }

      // optimistic update
      setFavoriteIds((prev) => new Set(prev).add(movieId))

      try {
        await addFavoriteForUser(currentUser.uid, movieId)
      } catch (err) {
        // revert optimistic update
        setFavoriteIds((prev) => {
          const next = new Set(prev)
          next.delete(movieId)
          return next
        })
        throw err
      }
    },
    [currentUser],
  )

  const removeFavorite = useCallback(
    async (movieId: string) => {
      if (!currentUser || !currentUser.uid) {
        throw new Error('Authentication required to remove favorites')
      }

      // optimistic update
      setFavoriteIds((prev) => {
        const next = new Set(prev)
        next.delete(movieId)
        return next
      })

      try {
        await removeFavoriteForUser(currentUser.uid, movieId)
      } catch (err) {
        // revert optimistic update
        setFavoriteIds((prev) => new Set(prev).add(movieId))
        throw err
      }
    },
    [currentUser],
  )

  const toggleFavorite = useCallback(
    async (movieId: string) => {
      if (!currentUser || !currentUser.uid) {
        throw new Error('Authentication required to toggle favorites')
      }

      if (favoriteIds.has(movieId)) {
        await removeFavorite(movieId)
        return false
      }

      await addFavorite(movieId)
      return true
    },
    [currentUser, favoriteIds, addFavorite, removeFavorite],
  )

  return {
    favoriteIds,
    isLoading,
    error,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    loadFavorites,
  }
}
