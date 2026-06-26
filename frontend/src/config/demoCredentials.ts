import type { UserRole } from '../types/firestore'

export interface DemoCredential {
  email: string
  password: string
  role: UserRole
  label: string
}

export const DEMO_CREDENTIALS: DemoCredential[] = [
  { email: 'admin@tthp.local', password: 'admin123', role: 'admin', label: 'System Admin' },
  { email: 'manager@tthp.local', password: 'manager123', role: 'management', label: 'Ops Manager' },
  { email: 'field@tthp.local', password: 'field123', role: 'field_team', label: 'Field & Operations' },
]

export function findDemoCredential(email: string, password: string) {
  return DEMO_CREDENTIALS.find(
    (c) => c.email.toLowerCase() === email.trim().toLowerCase() && c.password === password,
  )
}
