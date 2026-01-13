import { useCallback, useEffect, useMemo, useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import History from './pages/History'
import Favorites from './pages/Favorites'
import Settings from './pages/Settings'
import Admin from './pages/Admin'
import { auth } from './services/firebase'
import { subscribeVerses, checkAdmin } from './services/versesService'
import { pickRandomVerse, upsertHistory } from './utils/random'
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from './utils/localStore'
import './App.css'

const APP_VERSION = 'Ver.00d'

const defaultSettings = {
  fontSize: 'medium',
}

export default function App() {
  const [verses, setVerses] = useState([])
  const [currentVerse, setCurrentVerse] = useState(
    loadFromStorage(STORAGE_KEYS.lastVerse, null)
  )
  const [history, setHistory] = useState(
    loadFromStorage(STORAGE_KEYS.history, [])
  )
  const [favorites, setFavorites] = useState(
    loadFromStorage(STORAGE_KEYS.favorites, [])
  )
  const [settings, setSettings] = useState(
    loadFromStorage(STORAGE_KEYS.settings, defaultSettings)
  )
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [dataStatus, setDataStatus] = useState('Firestore接続: 確認中')

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (nextUser) => {
      setUser(nextUser)
      if (nextUser) {
        const admin = await checkAdmin(nextUser.uid)
        setIsAdmin(admin)
      } else {
        setIsAdmin(false)
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const unsubscribe = subscribeVerses(
      (items) => setVerses(items),
      setDataStatus,
      () => setDataStatus('Firestore未接続: ローカル表示')
    )
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (verses.length === 0) return
    if (!currentVerse || !verses.find((item) => item.id === currentVerse.id)) {
      const next = pickRandomVerse(verses, history, currentVerse?.id)
      if (next) {
        setCurrentVerse(next)
        setHistory((prev) => upsertHistory(prev, next))
      }
    }
  }, [verses, currentVerse, history])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.history, history)
  }, [history])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.favorites, favorites)
  }, [favorites])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.lastVerse, currentVerse)
  }, [currentVerse])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.settings, settings)
  }, [settings])

  const handleSwitch = useCallback(() => {
    const next = pickRandomVerse(verses, history, currentVerse?.id)
    if (!next) return
    setCurrentVerse(next)
    setHistory((prev) => upsertHistory(prev, next))
  }, [verses, history, currentVerse])

  const toggleFavorite = useCallback(() => {
    if (!currentVerse) return
    setFavorites((prev) => {
      const exists = prev.find((item) => item.id === currentVerse.id)
      if (exists) {
        return prev.filter((item) => item.id !== currentVerse.id)
      }
      return [currentVerse, ...prev]
    })
  }, [currentVerse])

  const handleHistorySelect = useCallback((verse) => {
    setCurrentVerse(verse)
  }, [])

  const handleClearHistory = useCallback(() => {
    setHistory([])
  }, [])

  const handleRemoveFavorite = useCallback((id) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const isFavorite = useMemo(() => {
    if (!currentVerse) return false
    return favorites.some((item) => item.id === currentVerse.id)
  }, [favorites, currentVerse])

  return (
    <HashRouter>
      <div className={`app font-${settings.fontSize || 'medium'}`}>
        <div className="version-badge">{APP_VERSION}</div>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                verse={currentVerse}
                onSwitch={handleSwitch}
                onToggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
              />
            }
          />
          <Route
            path="/history"
            element={
              <History
                history={history}
                onClear={handleClearHistory}
                onSelect={handleHistorySelect}
              />
            }
          />
          <Route
            path="/favorites"
            element={
              <Favorites
                favorites={favorites}
                onRemove={handleRemoveFavorite}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <Settings
                fontSize={settings.fontSize}
                onChangeFontSize={(size) =>
                  setSettings((prev) => ({ ...prev, fontSize: size }))
                }
                dataStatus={dataStatus}
                user={user}
              />
            }
          />
          <Route
            path="/admin"
            element={<Admin user={user} isAdmin={isAdmin} verses={verses} />}
          />
        </Routes>
      </div>
    </HashRouter>
  )
}
