import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../services/firebase'
import {
  createVerse,
  updateVerse,
  deleteVerse,
  createVersesBatch,
  seedIfEmpty,
} from '../services/versesService'
import { parseBulkInput } from '../utils/parseBulk'

const emptyForm = {
  reference: '',
  text: '',
  note: '',
  tags: '',
}

const parseTags = (input) =>
  input
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)

export default function Admin({ user, isAdmin, verses }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState(null)
  const [bulkText, setBulkText] = useState('')
  const [bulkPreview, setBulkPreview] = useState({ entries: [], errors: [] })

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return verses
    return verses.filter((verse) => {
      const text = `${verse.reference} ${verse.text} ${(verse.tags || []).join(' ')}`
      return text.toLowerCase().includes(keyword)
    })
  }, [verses, search])

  const handleLogin = async (event) => {
    event.preventDefault()
    setStatus('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      setStatus('ログインしました。')
    } catch (error) {
      console.error(error)
      setStatus('ログインに失敗しました。')
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
    setStatus('ログアウトしました。')
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    setStatus('')
    if (!form.reference || !form.text) {
      setStatus('聖書箇所 と みことば を入力してください。')
      return
    }
    await createVerse({
      reference: form.reference,
      text: form.text,
      note: form.note,
      tags: parseTags(form.tags),
    })
    setForm(emptyForm)
    setStatus('登録しました。')
  }

  const handleUpdate = async (event) => {
    event.preventDefault()
    if (!editing) return
    await updateVerse(editing.id, {
      reference: editing.reference,
      text: editing.text,
      note: editing.note,
      tags: parseTags(editing.tags || ''),
    })
    setEditing(null)
    setStatus('更新しました。')
  }

  const handleDelete = async (id) => {
    if (!confirm('削除してよろしいですか？')) return
    await deleteVerse(id)
    setStatus('削除しました。')
  }

  const handleBulkPreview = () => {
    setBulkPreview(parseBulkInput(bulkText))
  }

  const handleBulkCreate = async () => {
    if (bulkPreview.entries.length === 0) {
      setStatus('登録できる行がありません。')
      return
    }
    await createVersesBatch(bulkPreview.entries)
    setBulkText('')
    setBulkPreview({ entries: [], errors: [] })
    setStatus('一括登録しました。')
  }

  const handleSeed = async () => {
    const seeded = await seedIfEmpty(verses.length)
    setStatus(seeded ? '初期データを投入しました。' : '既にデータがあります。')
  }

  if (!user) {
    return (
      <div className="page">
        <header className="page-header">
          <h2>管理者ログイン</h2>
        </header>
        <form className="form" onSubmit={handleLogin}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            パスワード
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <button type="submit" className="primary-button">
            ログイン
          </button>
        </form>
        {status ? <p className="status-text">{status}</p> : null}
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="page">
        <header className="page-header">
          <h2>管理画面</h2>
        </header>
        <p className="status-text">管理者権限がありません。</p>
        <button type="button" className="ghost-button" onClick={handleLogout}>
          ログアウト
        </button>
      </div>
    )
  }

  return (
    <div className="page admin">
      <header className="page-header">
        <div>
          <h2>管理画面</h2>
          <p className="small-text">ログイン中: {user.email}</p>
        </div>
        <button type="button" className="ghost-button" onClick={handleLogout}>
          ログアウト
        </button>
      </header>

      {verses.length === 0 ? (
        <div className="seed-box">
          <p>Firestoreにデータがありません。</p>
          <button type="button" className="primary-button" onClick={handleSeed}>
            初期データを投入
          </button>
        </div>
      ) : null}

      {status ? <p className="status-text">{status}</p> : null}

      <section className="admin-section">
        <h3>検索</h3>
        <input
          type="text"
          placeholder="聖書箇所 / みことば / tag"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </section>

      <section className="admin-section">
        <h3>一覧</h3>
        {filtered.length === 0 ? (
          <p className="empty-text">該当するみことばがありません。</p>
        ) : (
          <ul className="list">
            {filtered.map((verse) => (
              <li key={verse.id} className="admin-item">
                <div className="list-info">
                  <span className="list-ref">{verse.reference}</span>
                  <span className="list-text">{verse.text}</span>
                </div>
                <div className="admin-actions">
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() =>
                      setEditing({
                        ...verse,
                        tags: (verse.tags || []).join(', '),
                      })
                    }
                  >
                    編集
                  </button>
                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => handleDelete(verse.id)}
                  >
                    削除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {editing ? (
        <section className="admin-section">
          <h3>編集</h3>
          <form className="form" onSubmit={handleUpdate}>
            <label>
              聖書箇所
              <input
                type="text"
                value={editing.reference}
                onChange={(event) =>
                  setEditing({ ...editing, reference: event.target.value })
                }
                required
              />
            </label>
            <label>
              みことば
              <textarea
                value={editing.text}
                onChange={(event) =>
                  setEditing({ ...editing, text: event.target.value })
                }
                rows={3}
                required
              />
            </label>
            <label>
              note
              <textarea
                value={editing.note || ''}
                onChange={(event) =>
                  setEditing({ ...editing, note: event.target.value })
                }
                rows={2}
              />
            </label>
            <label>
              tags (カンマ区切り)
              <input
                type="text"
                value={editing.tags || ''}
                onChange={(event) =>
                  setEditing({ ...editing, tags: event.target.value })
                }
              />
            </label>
            <div className="form-row">
              <button type="submit" className="primary-button">
                更新
              </button>
              <button
                type="button"
                className="ghost-button"
                onClick={() => setEditing(null)}
              >
                キャンセル
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <section className="admin-section">
        <h3>単発登録</h3>
        <form className="form" onSubmit={handleCreate}>
          <label>
            聖書箇所
            <input
              type="text"
              value={form.reference}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, reference: event.target.value }))
              }
              required
            />
          </label>
          <label>
            みことば
            <textarea
              value={form.text}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, text: event.target.value }))
              }
              rows={3}
              required
            />
          </label>
          <label>
            note
            <textarea
              value={form.note}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, note: event.target.value }))
              }
              rows={2}
            />
          </label>
          <label>
            tags (カンマ区切り)
            <input
              type="text"
              value={form.tags}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, tags: event.target.value }))
              }
            />
          </label>
          <button type="submit" className="primary-button">
            登録
          </button>
        </form>
      </section>

      <section className="admin-section">
        <h3>一括登録</h3>
        <textarea
          value={bulkText}
          onChange={(event) => setBulkText(event.target.value)}
          placeholder="reference|text|note|tags(カンマ区切り)"
          rows={6}
        />
        <div className="form-row">
          <button type="button" className="ghost-button" onClick={handleBulkPreview}>
            プレビュー
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={handleBulkCreate}
            disabled={bulkPreview.entries.length === 0}
          >
            登録
          </button>
        </div>
        {bulkPreview.errors.length > 0 ? (
          <div className="error-box">
            <p>エラー行:</p>
            <ul>
              {bulkPreview.errors.map((error) => (
                <li key={error.line}>
                  {error.line}行目: {error.message}
                  <span className="small-text">({error.input})</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {bulkPreview.entries.length > 0 ? (
          <div className="preview-box">
            <p>登録予定: {bulkPreview.entries.length}件</p>
            <ul>
              {bulkPreview.entries.map((entry, index) => (
                <li key={`${entry.reference}-${index}`}>
                  {entry.reference} | {entry.text}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </div>
  )
}
