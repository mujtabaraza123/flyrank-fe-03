export type Movie = {
  id: string
  title: string
  year: string
  genre: string
  rating: string
  description: string
  posterUrl?: string | null
  posterAccent: string
  isFavorite?: boolean
}
