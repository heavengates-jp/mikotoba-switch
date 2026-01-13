const safeJsonParse = (value, fallback) => {
  if (!value) return fallback
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export const STORAGE_KEYS = {
  settings: 'mikotoba-settings',
  favorites: 'mikotoba-favorites',
  history: 'mikotoba-history',
  lastVerse: 'mikotoba-last-verse',
}

export const loadFromStorage = (key, fallback) => {
  return safeJsonParse(localStorage.getItem(key), fallback)
}

export const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}