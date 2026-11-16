export function formatDate(dateStr: string): string {
  return new Date(dateStr).toISOString().slice(0, 10)
}

export function formatMonth(dateStr: string): string {
  return new Date(dateStr).toISOString().slice(0, 7)
}
