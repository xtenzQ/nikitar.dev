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

// Prerendered at build time, so the list is as fresh as the last deploy.
export default defineEventHandler(async (): Promise<Contribution[]> => {
  const { github } = useAppConfig()
  const headers = githubHeaders()

  try {
    const items: SearchItem[] = []
    // The search API stops at 1000 results
    for (let page = 1; page <= 10; page++) {
      const { items: batch } = await $fetch<{ items: SearchItem[] }>('https://api.github.com/search/issues', {
        headers,
        query: {
          q: `is:pr is:public author:${github.username} -user:${github.username}`,
          sort: 'created',
          order: 'desc',
          per_page: 100,
          page,
        },
      })
      items.push(...batch)
      if (batch.length < 100) break
    }

    return items
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
      .sort((a, b) => a.state === b.state ? b.date.localeCompare(a.date) : a.state === 'open' ? -1 : 1)
  }
  catch (error) {
    console.warn('[contributions] GitHub request failed, rendering an empty list:', error)
    return []
  }
})
