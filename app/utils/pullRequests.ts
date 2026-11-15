// "fix(web): let the lists scroll" → "Let the lists scroll"; "SOLR-6853: Add…" stays
export function plainPullRequestTitle(title: string): string {
  const stripped = title.replace(/^[a-z]+(\([^)]*\))?!?:\s*/, '')
  return stripped.charAt(0).toUpperCase() + stripped.slice(1)
}
