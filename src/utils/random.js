export const pickRandomVerse = (verses, history, currentId) => {
  if (!verses || verses.length === 0) return null
  const recentIds = (history || []).slice(0, 5).map((item) => item.id)
  if (currentId) recentIds.push(currentId)
  const candidates = verses.filter((verse) => !recentIds.includes(verse.id))
  const pool = candidates.length > 0 ? candidates : verses
  const index = Math.floor(Math.random() * pool.length)
  return pool[index]
}

export const upsertHistory = (history, verse, limit = 20) => {
  if (!verse) return history
  const without = (history || []).filter((item) => item.id !== verse.id)
  return [verse, ...without].slice(0, limit)
}