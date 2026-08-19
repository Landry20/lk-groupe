const TOKEN_KEY = 'lk.form.ticket'
const WINDOW_MS = 4 * 60 * 60 * 1000

export type FormTicket = {
  issuedAt: number
  nonce: string
}

export function issueTicket(): FormTicket {
  const ticket: FormTicket = {
    issuedAt: Date.now(),
    nonce: crypto.randomUUID(),
  }
  sessionStorage.setItem(TOKEN_KEY, JSON.stringify(ticket))
  return ticket
}

export function readTicket(): FormTicket | null {
  try {
    const raw = sessionStorage.getItem(TOKEN_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as FormTicket
    if (typeof parsed.issuedAt !== 'number' || typeof parsed.nonce !== 'string') return null
    return parsed
  } catch {
    return null
  }
}

export function cleanText(value: string, max = 2000): string {
  return value
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

export function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) && value.length <= 180
}

export function acceptSubmission(input: {
  name: string
  email: string
  company: string
  message: string
  trap: string
}): boolean {
  if (input.trap.trim().length > 0) return false
  const ticket = readTicket()
  if (!ticket) return false
  const elapsed = Date.now() - ticket.issuedAt
  if (elapsed < 1600 || elapsed > WINDOW_MS) return false
  if (input.name.length < 2 || input.message.length < 10) return false
  if (input.company.length > 160) return false
  if (!looksLikeEmail(input.email)) return false
  return true
}

export function burnTicket() {
  sessionStorage.removeItem(TOKEN_KEY)
}
