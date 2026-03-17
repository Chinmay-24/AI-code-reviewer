// Local storage utilities for favorites and settings

export interface FavoriteReview {
  id: string
  code: string
  language: string
  result: any
  mode: string
  model: string
  timestamp: number
  name: string
}

export interface UserSettings {
  theme: 'light' | 'dark'
  defaultLanguage: string
  defaultMode: string
}

const FAVORITES_KEY = 'code_reviewer_favorites'
const SETTINGS_KEY = 'code_reviewer_settings'

export const storage = {
  // Favorites
  getFavorites: (): FavoriteReview[] => {
    const data = localStorage.getItem(FAVORITES_KEY)
    return data ? JSON.parse(data) : []
  },

  addFavorite: (review: Omit<FavoriteReview, 'id' | 'timestamp'>, name: string) => {
    const favorites = storage.getFavorites()
    const newFavorite: FavoriteReview = {
      ...review,
      name,
      id: Math.random().toString(36).slice(2),
      timestamp: Date.now(),
    }
    favorites.push(newFavorite)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    return newFavorite
  },

  removeFavorite: (id: string) => {
    const favorites = storage.getFavorites()
    const filtered = favorites.filter((f) => f.id !== id)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered))
  },

  // Settings
  getSettings: (): UserSettings => {
    const data = localStorage.getItem(SETTINGS_KEY)
    return data
      ? JSON.parse(data)
      : { theme: 'light', defaultLanguage: 'javascript', defaultMode: 'detailed' }
  },

  updateSettings: (settings: Partial<UserSettings>) => {
    const current = storage.getSettings()
    const updated = { ...current, ...settings }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated))
    return updated
  },
}

export const codeMetrics = {
  analyze: (code: string) => {
    const lines = code.split('\n').length
    const nonEmptyLines = code.split('\n').filter((l) => l.trim()).length
    const functions = (code.match(/function|=>|async|class/g) || []).length
    const chars = code.length

    // Simple complexity estimate
    let complexity = 1
    if (code.includes('for') || code.includes('while')) complexity += 1
    if (code.includes('if') || code.includes('else')) complexity += 0.5
    if (code.includes('try') || code.includes('catch')) complexity += 0.5
    if (functions > 5) complexity += 1

    return {
      totalLines: lines,
      codeLines: nonEmptyLines,
      functions,
      characters: chars,
      complexity: Math.round(complexity * 10) / 10,
    }
  },
}
