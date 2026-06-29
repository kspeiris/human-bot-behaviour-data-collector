export function ExportButton({ className = '', onClick }) {
  return (
    <button type="button" className={`action-button ${className}`} onClick={onClick}>
      Export Data (CSV)
    </button>
  )
}
