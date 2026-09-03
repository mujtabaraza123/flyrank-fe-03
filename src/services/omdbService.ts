import type { Movie } from '../models/movie'

const OMDB_BASE_URL = 'https://www.omdbapi.com/'
const CURATED_DISCOVERY_TITLES = [
  'Inception',
  'Spirited Away',
  'The Matrix',
  'Arrival',
  'Parasite',
  'Dune',
]

const COMMON_QUERY_REPLACEMENTS: Record<string, string> = {
  aye: 'ae',
  ha: 'hai',
  muskil: 'mushkil',
  mushkil: 'mushkil',
}

type OmdbSearchItem = {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

type OmdbMovieDetail = OmdbSearchItem & {
  Genre?: string
  Plot?: string
  imdbRating?: string
  Runtime?: string
  Director?: string
  Actors?: string
}

type OmdbSearchResponse = {
  Search?: OmdbSearchItem[]
  Response: string
  Error?: string
}

type OmdbDetailResponse = OmdbMovieDetail & {
  Response: string
  Error?: string
}

export class QueryTooBroadError extends Error {
  constructor(message = 'That search is too broad. Please enter a more specific title or keyword.') {
    super(message)
    this.name = 'QueryTooBroadError'
  }
}

export class SearchApiError extends Error {
  constructor(message = 'The movie search is temporarily unavailable. Please try again later.') {
    super(message)
    this.name = 'SearchApiError'
  }
}

function buildPosterGradient(title: string): string {
  const gradients = [
    'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #7c2d12 100%)',
    'linear-gradient(135deg, #2dd4bf 0%, #0f172a 100%)',
    'linear-gradient(135deg, #38bdf8 0%, #172554 100%)',
    'linear-gradient(135deg, #fb7185 0%, #7f1d1d 100%)',
    'linear-gradient(135deg, #34d399 0%, #064e3b 100%)',
  ]

  const hash = title.split('').reduce((total, char) => total + char.charCodeAt(0), 0)
  return gradients[hash % gradients.length]
}

function normalizeGenre(type: string): string {
  return type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Movie'
}

function normalizePosterUrl(poster: string): string | null {
  return poster && poster !== 'N/A' ? poster : null
}

function normalizeQueryKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function buildExactTitleVariants(query: string): string[] {
  const variants = new Set<string>()
  const trimmed = query.trim()
  if (!trimmed) {
    return []
  }

  variants.add(trimmed)

  const normalized = normalizeQueryKey(trimmed)
  if (normalized) {
    variants.add(normalized)
  }

  const tokens = normalized.split(' ').filter(Boolean)
  if (tokens.length > 0) {
    const correctedTokens = tokens.map((token) => COMMON_QUERY_REPLACEMENTS[token] ?? token)
    const corrected = correctedTokens.join(' ')
    if (corrected) {
      variants.add(corrected)
    }

    const compacted = tokens.join(' ')
    if (compacted) {
      variants.add(compacted)
    }
  }

  return [...variants].filter(Boolean).slice(0, 5)
}

function mapOmdbMovie(item: OmdbMovieDetail): Movie {
  const genus = item.Genre ? item.Genre.split(',')[0].trim() : normalizeGenre(item.Type)

  return {
    id: item.imdbID,
    title: item.Title,
    year: item.Year || 'N/A',
    genre: genus || normalizeGenre(item.Type),
    rating: item.imdbRating || 'N/A',
    description: item.Plot && item.Plot !== 'N/A' ? item.Plot : 'No synopsis available from OMDb.',
    posterUrl: normalizePosterUrl(item.Poster),
    posterAccent: buildPosterGradient(item.Title),
    isFavorite: false,
  }
}

// New: fetch full movie details by imdbID using the `i` parameter
async function fetchMovieDetailsById(imdbID: string) {
  const apiKey = import.meta.env.VITE_OMDB_API_KEY

  if (!apiKey) {
    throw new SearchApiError('Movie details are temporarily unavailable. Please try again later.')
  }

  if (!imdbID || !imdbID.trim()) {
    throw new Error('Invalid movie id')
  }

  const endpoint = new URL(OMDB_BASE_URL)
  endpoint.searchParams.set('apikey', apiKey)
  endpoint.searchParams.set('i', imdbID.trim())
  endpoint.searchParams.set('plot', 'full')

  let response: Response
  try {
    response = await fetch(endpoint.toString())
  } catch {
    throw new SearchApiError('We could not reach the movie service. Please try again in a moment.')
  }

  if (!response.ok) {
    throw new SearchApiError('The movie service is temporarily unavailable. Please try again later.')
  }

  const payload = (await response.json()) as OmdbDetailResponse

  if (payload.Response === 'False') {
    throw new SearchApiError(payload.Error ?? 'Could not load movie details')
  }

  return payload
}

function mapOmdbResult(item: OmdbSearchItem): Movie {
  return mapOmdbMovie({
    ...item,
    Genre: undefined,
    Plot: undefined,
    imdbRating: undefined,
  })
}

async function fetchMoviesByQuery(query: string, page = 1): Promise<Movie[]> {
  const apiKey = import.meta.env.VITE_OMDB_API_KEY

  if (!apiKey) {
    throw new SearchApiError('Movie search is temporarily unavailable. Please try again later.')
  }

  const normalizedQuery = query.trim()
  if (!normalizedQuery) {
    return []
  }

  const endpoint = new URL(OMDB_BASE_URL)
  endpoint.searchParams.set('apikey', apiKey)
  endpoint.searchParams.set('s', normalizedQuery)
  endpoint.searchParams.set('page', String(Math.max(1, page)))

  let response: Response
  try {
    response = await fetch(endpoint.toString())
  } catch {
    throw new SearchApiError('We could not reach the movie service. Please try again in a moment.')
  }

  if (!response.ok) {
    throw new SearchApiError('The movie service is temporarily unavailable. Please try again later.')
  }

  const payload = (await response.json()) as OmdbSearchResponse

  if (payload.Response === 'False') {
    const message = payload.Error?.toLowerCase() ?? ''

    if (message.includes('too many results')) {
      throw new QueryTooBroadError('That search is too broad. Please enter a more specific title or keyword.')
    }

    if (message.includes('movie not found') || message.includes('not found')) {
      return []
    }

    throw new SearchApiError('The movie search is temporarily unavailable. Please try again later.')
  }

  if (!payload.Search || payload.Search.length === 0) {
    return []
  }

  return payload.Search.map(mapOmdbResult)
}

async function fetchExactMovieByTitle(query: string): Promise<Movie | null> {
  const apiKey = import.meta.env.VITE_OMDB_API_KEY

  if (!apiKey) {
    throw new SearchApiError('Movie search is temporarily unavailable. Please try again later.')
  }

  const trimmedQuery = query.trim()
  if (!trimmedQuery) {
    return null
  }

  const candidates = buildExactTitleVariants(trimmedQuery)

  for (const candidate of candidates) {
    const endpoint = new URL(OMDB_BASE_URL)
    endpoint.searchParams.set('apikey', apiKey)
    endpoint.searchParams.set('t', candidate)

    let response: Response
    try {
      response = await fetch(endpoint.toString())
    } catch {
      continue
    }

    if (!response.ok) {
      continue
    }

    const payload = (await response.json()) as OmdbDetailResponse

    if (payload.Response === 'True' && payload.Title) {
      return mapOmdbMovie(payload)
    }
  }

  return null
}

export async function searchMovies(query: string, page = 1): Promise<Movie[]> {
  const normalizedQuery = query.trim()
  if (!normalizedQuery) {
    return []
  }

  try {
    const searchResults = await fetchMoviesByQuery(normalizedQuery, page)
    if (searchResults.length > 0) {
      return searchResults
    }

    const exactMatch = await fetchExactMovieByTitle(normalizedQuery)
    return exactMatch ? [exactMatch] : []
  } catch (caughtError) {
    if (caughtError instanceof QueryTooBroadError) {
      const exactMatch = await fetchExactMovieByTitle(normalizedQuery)
      if (exactMatch) {
        return [exactMatch]
      }

      throw caughtError
    }

    throw caughtError
  }
}

export async function loadInitialDiscoveryMovies(): Promise<Movie[]> {
  const seenIds = new Set<string>()
  const results: Movie[] = []

  for (const title of CURATED_DISCOVERY_TITLES) {
    const matches = await fetchMoviesByQuery(title, 1)

    for (const movie of matches) {
      if (seenIds.has(movie.id)) {
        continue
      }

      seenIds.add(movie.id)
      results.push(movie)

      if (results.length >= 6) {
        return results
      }
    }
  }

  if (results.length === 0) {
    throw new SearchApiError('We could not load the discovery picks. Please try again later.')
  }

  return results
}

export { fetchMovieDetailsById }
