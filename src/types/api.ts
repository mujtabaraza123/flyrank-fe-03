export type MovieSearchQuery = string

export type MovieResponseShape = {
  Search?: Array<{
    Title: string
    Year: string
    imdbID: string
    Type: string
    Poster: string
  }>
  totalResults?: string
  Response: string
  Error?: string
}
