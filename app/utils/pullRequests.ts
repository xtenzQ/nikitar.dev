export function plainPullRequestTitle(title: string): string {
  const stripped = title.replace(/^[a-z]+(\([^)]*\))?!?:\s*/, '')
  return stripped.charAt(0).toUpperCase() + stripped.slice(1)
}
