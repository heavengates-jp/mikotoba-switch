import { useEffect, useRef, useState } from 'react'

export default function SwitchButton({ onClick, disabled }) {
  const [pressed, setPressed] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleClick = () => {
    onClick?.()
    setPressed(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setPressed(false), 260)
  }

  return (
    <button
      type="button"
      className={`switch-button ${pressed ? 'pressed' : ''}`}
      onClick={handleClick}
      disabled={disabled}
    >
      <span className="switch-track">
        <span className="switch-thumb" />
      </span>
      <span className="switch-label">つぎのみことばへ</span>
    </button>
  )
}