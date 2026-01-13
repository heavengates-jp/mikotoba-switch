export default function SwitchButton({ onClick, disabled }) {
  return (
    <button
      type="button"
      className="switch-button"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="switch-track">
        <span className="switch-thumb" />
      </span>
      <span className="switch-label">スイッチ</span>
    </button>
  )
}