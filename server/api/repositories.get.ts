export default defineEventHandler(async (): Promise<Record<string, string>> => {
  const contributions = await $fetch('/api/contributions')
  const repos = [...new Set(contributions.map(pr => pr.repo))]

  const entries = await Promise.all(repos.map(async (repo) => {
    try {
      const { description } = await $fetch<{ description: string | null }>(`https://api.github.com/repos/${repo}`, {
        headers: githubHeaders(),
      })
      return [repo, description?.trim() ?? ''] as const
    }
    catch (error) {
      console.warn(`[repositories] GitHub request for ${repo} failed, leaving out its description:`, error)
      return [repo, ''] as const
    }
  }))

  return Object.fromEntries(entries.filter(([, description]) => description))
})
