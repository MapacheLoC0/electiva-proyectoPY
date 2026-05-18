export default function KpiCard({ titulo, valor, color }) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        transition: 'all var(--transition)',
      }}
    >
      <div
        style={{
          width: 42,
          height: 4,
          borderRadius: 20,
          background: color,
        }}
      />

      <span
        style={{
          fontSize: 12,
          color: 'var(--text-secondary)',
          fontWeight: 500,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
        }}
      >
        {titulo}
      </span>

      <h2
        style={{
          margin: 0,
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--text-primary)',
          wordBreak: 'break-word',
        }}
      >
        {valor}
      </h2>
    </div>
  )
}