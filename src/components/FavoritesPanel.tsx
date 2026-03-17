'use client'

import React from 'react'
import { FavoriteReview, storage } from '@/lib/storage'

interface FavoritesPanelProps {
  isOpen: boolean
  onClose: () => void
  onLoadFavorite: (review: FavoriteReview) => void
}

export default function FavoritesPanel({ isOpen, onClose, onLoadFavorite }: FavoritesPanelProps) {
  const [favorites, setFavorites] = React.useState<FavoriteReview[]>(storage.getFavorites())

  const removeFavorite = (id: string) => {
    storage.removeFavorite(id)
    setFavorites(storage.getFavorites())
  }

  React.useEffect(() => {
    setFavorites(storage.getFavorites())
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-2xl w-full p-6 space-y-4 animate-slideDown max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 pb-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Saved Reviews ({favorites.length})</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold text-xl"
          >
            ✕
          </button>
        </div>

        {favorites.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400 py-8">
            No saved reviews yet. Star a review to save it!
          </p>
        ) : (
          <div className="space-y-2">
            {favorites.map((fav) => (
              <button
                key={fav.id}
                onClick={() => {
                  onLoadFavorite(fav)
                  onClose()
                }}
                className="w-full text-left p-4 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {fav.name}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {fav.language} • {fav.mode} • {fav.model.split('/')[1] || fav.model}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 font-mono truncate">
                      {fav.code.slice(0, 60)}...
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFavorite(fav.id)
                    }}
                    className="ml-4 px-3 py-1.5 text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-all font-medium"
                  >
                    Remove
                  </button>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                  {new Date(fav.timestamp).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-4 px-4 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium rounded-lg transition-all"
        >
          Close
        </button>
      </div>
    </div>
  )
}

