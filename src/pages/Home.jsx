import { Link } from 'react-router-dom'
import VerseCard from '../components/VerseCard'
import SwitchButton from '../components/SwitchButton'

export default function Home({ verse, onSwitch, onToggleFavorite, isFavorite }) {
  return (
    <div className="page home">
      <header className="hero">
        <div>
          <h1>みことばスイッチ</h1>
          <p className="subtitle">金の領域で捉える</p>
        </div>
      </header>

      <section className="card-section">
        <VerseCard verse={verse} />
      </section>

      <section className="actions">
        <SwitchButton onClick={onSwitch} disabled={!verse} />
        <button
          type="button"
          className={`primary-button ${isFavorite ? 'active' : ''}`}
          onClick={onToggleFavorite}
          disabled={!verse}
        >
          {isFavorite ? 'お気に入り済み' : 'お気に入り'}
        </button>
        <div className="link-row">
          <Link to="/history" className="ghost-button">履歴へ</Link>
          <Link to="/favorites" className="ghost-button">お気に入り</Link>
          <Link to="/settings" className="ghost-button">設定へ</Link>
        </div>
      </section>

      <footer className="footer">黙想しよう。</footer>
    </div>
  )
}