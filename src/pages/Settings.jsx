import { Link } from 'react-router-dom'

export default function Settings({ fontSize, onChangeFontSize, dataStatus, user }) {
  return (
    <div className="page">
      <header className="page-header">
        <h2>設定</h2>
      </header>

      <section className="settings-section">
        <h3>文字サイズ</h3>
        <div className="segmented">
          {['small', 'medium', 'large'].map((size) => (
            <button
              key={size}
              type="button"
              className={`segment ${fontSize === size ? 'active' : ''}`}
              onClick={() => onChangeFontSize(size)}
            >
              {size === 'small' ? '小' : size === 'medium' ? '中' : '大'}
            </button>
          ))}
        </div>
      </section>

      <section className="settings-section">
        <h3>データソース</h3>
        <p className="status-chip">{dataStatus}</p>
      </section>

      <section className="settings-section">
        <h3>管理</h3>
        <Link to="/admin" className="primary-button">
          {user ? '管理画面へ' : '管理者ログインへ'}
        </Link>
      </section>
    </div>
  )
}