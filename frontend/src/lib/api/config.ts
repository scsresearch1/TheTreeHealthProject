/** Render / production API origin (no trailing slash). Empty = same-origin `/api` (Vite or Netlify proxy). */
export function getApiBase(): string {
  const value = import.meta.env.VITE_API_URL
  if (typeof value !== 'string') return ''
  return value.trim().replace(/\/$/, '')
}

export function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const base = getApiBase()
  return base ? `${base}${normalized}` : normalized
}
