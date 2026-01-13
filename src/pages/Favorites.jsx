import { Link } from 'react-router-dom'
import VerseCard from '../components/VerseCard'

export default function Favorites({ favorites, onRemove }) {
  const first = favorites[0] || null

  return (
    <div className="page">
      <header className="page-header">
        <h2>お気に入り</h2>
        <Link to="/" className="ghost-button">ホームへ戻る</Link>
      </header>

      <section className="card-section">
        <VerseCard verse={first} />
      </section>

      <section className="list-section">
        {favorites.length === 0 ? (
          <p className="empty-text">お気に入りがまだありません。</p>
        ) : (
          <ul className="list">
            {favorites.map((item) => (
              <li key={item.id} className="list-row">
                <div className="list-info">
                  <span className="list-ref">{item.reference}</span>
                  <span className="list-text">{item.text}</span>
                </div>
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => onRemove(item.id)}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
