type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
}

export function SearchBar({ value, onChange, onSubmit, isLoading }: SearchBarProps) {
  return (
    <form
      className="search-form"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <label htmlFor="movie-search" className="sr-only">
        Search for a movie
      </label>

      <div className="search-input-wrap">
        <input
          id="movie-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search by title or genre"
          autoComplete="off"
        />

        <button type="submit" className="search-button" disabled={isLoading}>
          {isLoading ? 'Searching…' : 'Search'}
        </button>
      </div>
    </form>
  )
}
