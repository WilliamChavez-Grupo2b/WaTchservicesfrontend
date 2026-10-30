import React, { useState } from 'react'

const col = {
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  th: {
    textAlign: 'left', padding: '10px 12px', color: 'var(--muted)',
    borderBottom: '1px solid var(--border)', fontWeight: 600,
    fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5
  },
  td: { padding: '9px 12px', borderBottom: '1px solid var(--border)', verticalAlign: 'top' },
  badge: { padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 700 },
  success: { background: 'rgba(34,197,94,0.12)', color: 'var(--success)' },
  error: { background: 'rgba(239,68,68,0.12)', color: 'var(--error)' },
  muted: { color: 'var(--muted)', fontSize: 12 },
  expanded: {
    background: '#12151f', padding: '10px 14px', borderRadius: 6, marginTop: 6,
    fontFamily: 'monospace', fontSize: 12, color: '#94a3b8',
    maxHeight: 200, overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word'
  }
}

function formatTs(ts) {
  if (!ts) return '—'
  const d = new Date(ts)
  return d.toLocaleString('en-US', {
    month: 'short', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  })
}

function LogRow({ log }) {
  const [open, setOpen] = useState(false)
  const isErr = log.status === 'ERROR'

  return (
    <>
      <tr
        onClick={() => setOpen(o => !o)}
        style={{ cursor: 'pointer', background: open ? '#12151f' : 'transparent' }}
      >
        <td style={col.td}>
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--muted)' }}>
            {log.requestId?.slice(0, 8)}…
          </span>
        </td>
        <td style={col.td}>
          <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{log.serviceId}</span>
        </td>
        <td style={col.td}>{log.operation}</td>
        <td style={col.td}>{log.durationMs} ms</td>
        <td style={col.td}>
          <span style={{ ...col.badge, ...(isErr ? col.error : col.success) }}>
            {log.status}
          </span>
        </td>
        <td style={{ ...col.td, ...col.muted }}>{formatTs(log.timestamp)}</td>
        <td style={{ ...col.td, color: 'var(--accent)', fontSize: 16 }}>
          {open ? '▲' : '▼'}
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={7} style={{ padding: '0 12px 12px' }}>
            <div>
              {log.inputParams && (
                <div>
                  <div style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 2 }}>INPUT PARAMS</div>
                  <div style={col.expanded}>{log.inputParams}</div>
                </div>
              )}
              {log.responseData && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 2 }}>RESPONSE</div>
                  <div style={col.expanded}>{log.responseData}</div>
                </div>
              )}
              {log.errorMessage && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ color: 'var(--error)', fontSize: 11, marginBottom: 2 }}>ERROR</div>
                  <div style={{ ...col.expanded, color: '#fca5a5' }}>{log.errorMessage}</div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function LogsTable({ logs = [] }) {
  if (!logs.length) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
        No logs found. Try adjusting the filters or simulate a load.
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={col.table}>
        <thead>
          <tr>
            {['Request ID', 'Service', 'Operation', 'Duration', 'Status', 'Timestamp', ''].map(h => (
              <th key={h} style={col.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {logs.map(log => <LogRow key={log.id} log={log} />)}
        </tbody>
      </table>
    </div>
  )
}
