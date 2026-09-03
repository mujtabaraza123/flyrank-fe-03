export type MovieDetail = {
  id: string // imdbID
  title: string
  year: string
  genre?: string
  runtime?: string
  imdbRating?: string
  plot?: string
  director?: string
  actors?: string
  posterUrl?: string | null
  posterAccent?: string
}
