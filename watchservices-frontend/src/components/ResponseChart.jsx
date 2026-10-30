import React from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'

const SERVICE_COLORS = {
  inventory: '#6366f1',
  orders: '#22d3ee',
  payments: '#f59e0b'
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#1a1d27', border: '1px solid #2a2d3e',
      borderRadius: 8, padding: '8px 14px', fontSize: 12
    }}>
      <p style={{ color: '#64748b', marginBottom: 4 }}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <strong>{p.value} ms</strong>
          {p.payload.status === 'ERROR' && ' ⚠'}
        </p>
      ))}
    </div>
  )
}

export default function ResponseChart({ data, services = ['inventory', 'orders', 'payments'] }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius)', padding: '20px 24px'
    }}>
      <h3 style={{ marginBottom: 16, fontWeight: 600, fontSize: 15 }}>
        Response Times — Last 20 Calls per Service
      </h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3e" />
          <XAxis dataKey="index" stroke="#64748b" tick={{ fontSize: 11 }} />
          <YAxis stroke="#64748b" tick={{ fontSize: 11 }} unit=" ms" />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            formatter={v => <span style={{ color: '#e2e8f0' }}>{v}</span>}
          />
          {services.map(svc => (
            <Line
              key={svc}
              type="monotone"
              dataKey={svc}
              name={svc}
              stroke={SERVICE_COLORS[svc] || '#8884d8'}
              strokeWidth={2}
              dot={{ r: 3, fill: SERVICE_COLORS[svc] }}
              activeDot={{ r: 5 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
