import React, { useState, useCallback } from 'react'
import { getMetricsSummary, getLogs, getRecentLogs, simulateLoad } from './api/axios'
import { usePolling } from './hooks/usePolling'
import ServiceCard from './components/ServiceCard'
import ResponseChart from './components/ResponseChart'
import LogsTable from './components/LogsTable'
import LogFilters from './components/LogFilters'

const SERVICES = ['inventory', 'orders', 'payments']

// Merge last-20 logs from 3 services into chart data (up to 20 points)
function buildChartData(recentMap) {
  const len = 20
  return Array.from({ length: len }, (_, i) => {
    const point = { index: i + 1 }
    SERVICES.forEach(svc => {
      const list = recentMap[svc] || []
      const reversed = [...list].reverse()
      if (reversed[i]) point[svc] = reversed[i].durationMs
    })
    return point
  })
}

export default function App() {
  const [summaries, setSummaries] = useState([])
  const [recentMap, setRecentMap] = useState({})
  const [logs, setLogs] = useState([])
  const [pagination, setPagination] = useState({ totalElements: 0, totalPages: 0 })
  const [filters, setFilters] = useState({ page: 0, size: 20 })
  const [simulating, setSimulating] = useState(false)
  const [simResult, setSimResult] = useState(null)
  const [error, setError] = useState(null)

  // Build API filter params (exclude empty values)
  const buildParams = useCallback((f) => {
    const p = { page: f.page ?? 0, size: f.size ?? 20 }
    if (f.service) p.service = f.service
    if (f.status) p.status = f.status
    if (f.from) p.from = new Date(f.from).toISOString()
    if (f.to) p.to = new Date(f.to).toISOString()
    return p
  }, [])

  const fetchAll = useCallback(async () => {
    try {
      const [sumRes, logRes, ...recentRes] = await Promise.all([
        getMetricsSummary(),
        getLogs(buildParams(filters)),
        ...SERVICES.map(s => getRecentLogs(s))
      ])
      setSummaries(sumRes.data)
      setLogs(logRes.data.logs)
      setPagination({ totalElements: logRes.data.totalElements, totalPages: logRes.data.totalPages })
      const map = {}
      SERVICES.forEach((s, i) => { map[s] = recentRes[i].data })
      setRecentMap(map)
      setError(null)
    } catch (err) {
      setError('Cannot reach backend. Is it running?')
    }
  }, [filters, buildParams])

  usePolling(fetchAll, 3000, [filters])

  const handleSimulate = async () => {
    setSimulating(true)
    setSimResult(null)
    try {
      const res = await simulateLoad()
      setSimResult(res.data)
    } catch {
      setSimResult({ message: 'Simulation failed — check backend.' })
    } finally {
      setSimulating(false)
    }
  }

  const chartData = buildChartData(recentMap)

  return (
    <div style={{ minHeight: '100vh', padding: '24px 32px', maxWidth: 1280, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>
            <span style={{ color: 'var(--accent)' }}>⬡</span> WatchServices
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>
            Microservices Observability Dashboard — polling every 3s
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {simResult && (
            <span style={{ fontSize: 12, color: 'var(--success)' }}>
              ✓ {simResult.success} ok / {simResult.errors} err
            </span>
          )}
          <button
            onClick={handleSimulate}
            disabled={simulating}
            style={{
              background: 'var(--accent)', color: '#fff', padding: '9px 18px',
              borderRadius: 8, fontWeight: 600, opacity: simulating ? 0.6 : 1,
              transition: 'opacity 0.2s'
            }}
          >
            {simulating ? 'Simulating…' : '⚡ Simulate Load'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid var(--error)',
          borderRadius: 8, padding: '10px 16px', marginBottom: 20, color: 'var(--error)'
        }}>
          ⚠ {error}
        </div>
      )}

      {/* Service Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 16, marginBottom: 24
      }}>
        {SERVICES.map(svc => {
          const summary = summaries.find(s => s.serviceId === svc) || {
            serviceId: svc, totalCalls: 0, errorCount: 0, errorRate: 0, avgResponseMs: 0
          }
          return <ServiceCard key={svc} summary={summary} />
        })}
      </div>

      {/* Response Time Chart */}
      <div style={{ marginBottom: 24 }}>
        <ResponseChart data={chartData} services={SERVICES} />
      </div>

      {/* Logs Section */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '20px 24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <h3 style={{ fontWeight: 700, fontSize: 15 }}>
            Live Logs
            <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: 13, marginLeft: 8 }}>
              ({pagination.totalElements} total)
            </span>
          </h3>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>
            Page {(filters.page ?? 0) + 1} / {pagination.totalPages || 1}
          </span>
        </div>

        <LogFilters filters={filters} onChange={setFilters} />
        <LogsTable logs={logs} />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
            <button
              disabled={(filters.page ?? 0) === 0}
              onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
              style={{
                background: 'var(--border)', color: 'var(--text)', padding: '6px 14px',
                borderRadius: 6, opacity: (filters.page ?? 0) === 0 ? 0.4 : 1
              }}
            >← Prev</button>
            <button
              disabled={(filters.page ?? 0) >= pagination.totalPages - 1}
              onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
              style={{
                background: 'var(--border)', color: 'var(--text)', padding: '6px 14px',
                borderRadius: 6,
                opacity: (filters.page ?? 0) >= pagination.totalPages - 1 ? 0.4 : 1
              }}
            >Next →</button>
          </div>
        )}
      </div>
    </div>
  )
}
