import type { MouseEvent } from 'react'

type FavoriteButtonProps = {
  isActive: boolean
  onToggle: (e?: MouseEvent<HTMLButtonElement>) => void
}

export function FavoriteButton({ isActive, onToggle }: FavoriteButtonProps) {
  return (
    <button
      type="button"
      className={`favorite-button ${isActive ? 'is-active' : ''}`}
      aria-label={isActive ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={isActive}
      onClick={(e) => {
        e.stopPropagation()
        onToggle?.(e)
      }}
    >
      <span aria-hidden="true">{isActive ? '♥' : '♡'}</span>
      {isActive ? 'Saved' : 'Save'}
    </button>
  )
}
