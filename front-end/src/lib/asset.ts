export function asset(path: string) {
  const base = import.meta.env.BASE_URL
  return `${base}${path.replace(/^\//, '')}`
}

export const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'
