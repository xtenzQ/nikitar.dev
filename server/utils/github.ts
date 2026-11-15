export function githubHeaders(): Record<string, string> {
  const { githubToken } = useRuntimeConfig()
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'nikitar.dev',
  }
  if (githubToken) headers.Authorization = `Bearer ${githubToken}`
  return headers
}
