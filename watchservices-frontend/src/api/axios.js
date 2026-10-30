import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

export const getMetricsSummary = () => api.get('/api/metrics/summary')

export const getLogs = (params) => api.get('/api/metrics/logs', { params })

export const getRecentLogs = (serviceId) =>
  api.get(`/api/metrics/recent/${serviceId}`)

export const simulateLoad = () => api.post('/api/metrics/simulate-load')

export const callService = (service, operation, params = []) =>
  api.post(`/api/services/${service}/${operation}`, { operation, params })

export default api
