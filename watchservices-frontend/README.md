# WatchServices Frontend

React + Vite + Recharts observability dashboard.

## Local run
```bash
npm install
npm run dev        # http://localhost:5173
```

## Render Deployment

| Field | Value |
|---|---|
| **Service type** | Static Site |
| **Build command** | `npm install && npm run build` |
| **Publish directory** | `dist` |

### Environment Variables on Render
| Key | Value |
|---|---|
| `VITE_API_URL` | `https://YOUR-BACKEND.onrender.com` |

> Set `VITE_API_URL` BEFORE building — Vite bakes it into the bundle at build time.
