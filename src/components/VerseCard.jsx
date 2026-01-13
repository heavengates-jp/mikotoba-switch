export default function VerseCard({ verse }) {
  if (!verse) {
    return (
      <div className="verse-card empty">
        <p className="verse-empty">みことばを読み込み中です。</p>
      </div>
    )
  }

  return (
    <div className="verse-card">
      <p className="verse-ref">{verse.reference}</p>
      <p className="verse-text">{verse.text}</p>
      {verse.note ? <p className="verse-note">{verse.note}</p> : null}
      {verse.tags && verse.tags.length > 0 ? (
        <div className="verse-tags">
          {verse.tags.map((tag) => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      ) : null}
    </div>
  )
}