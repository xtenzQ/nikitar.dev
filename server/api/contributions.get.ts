interface SearchItem {
  title: string
  number: number
  html_url: string
  repository_url: string
  state: 'open' | 'closed'
  created_at: string
  pull_request?: { merged_at: string | null }
}

export interface Contribution {
  title: string
  number: number
  url: string
  repo: string
  owner: string
  state: 'open' | 'merged'
  date: string
}

export interface Contributions {
  /** Newest first, capped at github.limit */
  pullRequests: Contribution[]
  /** Counted over every pull request that passes the filters, not just the capped list */
  merged: number
  open: number
}

// Prerendered at build time, so the list is as fresh as the last deploy.
export default defineEventHandler(async (): Promise<Contributions> => {
  const { github } = useAppConfig()
  const { githubToken } = useRuntimeConfig()

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github+json',
    'User-Agent': 'nikitar.dev',
  }
  if (githubToken) headers.Authorization = `Bearer ${githubToken}`

  try {
    const { items } = await $fetch<{ items: SearchItem[] }>('https://api.github.com/search/issues', {
      headers,
      query: {
        q: `is:pr is:public author:${github.username} -user:${github.username}`,
        sort: 'created',
        order: 'desc',
        per_page: 100,
      },
    })

    const pullRequests = items
      .filter(item => item.state === 'open' || item.pull_request?.merged_at)
      .map((item) => {
        const repo = item.repository_url.replace('https://api.github.com/repos/', '')
        return {
          title: item.title,
          number: item.number,
          url: item.html_url,
          repo,
          owner: repo.split('/')[0]!,
          state: item.state === 'open' ? 'open' : 'merged',
          date: item.pull_request?.merged_at ?? item.created_at,
        } satisfies Contribution
      })
      .filter(c => !github.hidden.includes(c.repo) && !github.hidden.includes(`${c.repo}#${c.number}`))

    return {
      pullRequests: pullRequests.slice(0, github.limit),
      merged: pullRequests.filter(c => c.state === 'merged').length,
      open: pullRequests.filter(c => c.state === 'open').length,
    }
  }
  catch (error) {
    console.warn('[contributions] GitHub request failed, rendering an empty list:', error)
    return { pullRequests: [], merged: 0, open: 0 }
  }
})
