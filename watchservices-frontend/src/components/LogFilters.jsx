import React from 'react'

const s = {
  bar: {
    display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: 16
  },
  label: { color: 'var(--muted)', fontSize: 12, marginRight: 4 },
  group: { display: 'flex', alignItems: 'center', gap: 6 }
}

export default function LogFilters({ filters, onChange }) {
  const set = (key, val) => onChange({ ...filters, [key]: val, page: 0 })

  return (
    <div style={s.bar}>
      <div style={s.group}>
        <span style={s.label}>Service</span>
        <select value={filters.service || ''} onChange={e => set('service', e.target.value)}>
          <option value="">All</option>
          <option value="inventory">Inventory</option>
          <option value="orders">Orders</option>
          <option value="payments">Payments</option>
        </select>
      </div>

      <div style={s.group}>
        <span style={s.label}>Status</span>
        <select value={filters.status || ''} onChange={e => set('status', e.target.value)}>
          <option value="">All</option>
          <option value="SUCCESS">Success</option>
          <option value="ERROR">Error</option>
        </select>
      </div>

      <div style={s.group}>
        <span style={s.label}>From</span>
        <input
          type="datetime-local"
          value={filters.from || ''}
          onChange={e => set('from', e.target.value)}
        />
      </div>

      <div style={s.group}>
        <span style={s.label}>To</span>
        <input
          type="datetime-local"
          value={filters.to || ''}
          onChange={e => set('to', e.target.value)}
        />
      </div>

      <button
        onClick={() => onChange({ page: 0 })}
        style={{
          background: 'transparent', border: '1px solid var(--border)',
          color: 'var(--muted)', padding: '5px 12px', borderRadius: 6
        }}
      >
        Clear
      </button>
    </div>
  )
}
