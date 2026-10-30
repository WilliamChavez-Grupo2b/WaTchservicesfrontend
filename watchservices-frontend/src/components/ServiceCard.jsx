import React from 'react'

const styles = {
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    transition: 'border-color 0.3s',
  },
  cardError: { borderColor: 'var(--error)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontWeight: 700, fontSize: 16, textTransform: 'capitalize' },
  badge: {
    padding: '2px 10px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0.5,
  },
  badgeOk: { background: 'rgba(34,197,94,0.15)', color: 'var(--success)' },
  badgeErr: { background: 'rgba(239,68,68,0.15)', color: 'var(--error)' },
  stat: { display: 'flex', justifyContent: 'space-between', color: 'var(--muted)', fontSize: 13 },
  statVal: { color: 'var(--text)', fontWeight: 600 },
  errorRate: { color: 'var(--error)', fontWeight: 700 },
}

export default function ServiceCard({ summary }) {
  if (!summary) return null
  const { serviceId, totalCalls, errorCount, errorRate, avgResponseMs } = summary
  const hasIssue = errorRate > 15

  return (
    <div style={{ ...styles.card, ...(hasIssue ? styles.cardError : {}) }}>
      <div style={styles.header}>
        <span style={styles.name}>{serviceId}</span>
        <span style={{ ...styles.badge, ...(hasIssue ? styles.badgeErr : styles.badgeOk) }}>
          {hasIssue ? '⚠ HIGH ERROR' : '✓ HEALTHY'}
        </span>
      </div>
      <div style={styles.stat}>
        <span>Total Calls</span>
        <span style={styles.statVal}>{totalCalls}</span>
      </div>
      <div style={styles.stat}>
        <span>Error Count</span>
        <span style={styles.statVal}>{errorCount}</span>
      </div>
      <div style={styles.stat}>
        <span>Error Rate</span>
        <span style={hasIssue ? styles.errorRate : styles.statVal}>{errorRate.toFixed(1)}%</span>
      </div>
      <div style={styles.stat}>
        <span>Avg Response</span>
        <span style={styles.statVal}>{avgResponseMs.toFixed(0)} ms</span>
      </div>
    </div>
  )
}
