// ISO-style dates, set in mono: 2026-02-12 / 2026-02
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toISOString().slice(0, 10)
}

export function formatMonth(dateStr: string): string {
  return new Date(dateStr).toISOString().slice(0, 7)
}
