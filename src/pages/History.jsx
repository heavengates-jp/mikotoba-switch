import { useMemo, useState } from 'react'
import VerseCard from '../components/VerseCard'

export default function History({ history, onClear, onSelect }) {
  const [selectedId, setSelectedId] = useState(history[0]?.id || null)

  const selected = useMemo(() => {
    return history.find((item) => item.id === selectedId) || history[0] || null
  }, [history, selectedId])

  const handleSelect = (item) => {
    setSelectedId(item.id)
    onSelect?.(item)
  }

  return (
    <div className="page">
      <header className="page-header">
        <h2>履歴</h2>
        <button type="button" className="danger-button" onClick={onClear}>
          履歴を消す
        </button>
      </header>

      <section className="card-section">
        <VerseCard verse={selected} />
      </section>

      <section className="list-section">
        {history.length === 0 ? (
          <p className="empty-text">まだ履歴がありません。</p>
        ) : (
          <ul className="list">
            {history.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`list-item ${selectedId === item.id ? 'active' : ''}`}
                  onClick={() => handleSelect(item)}
                >
                  <span className="list-ref">{item.reference}</span>
                  <span className="list-text">{item.text}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}