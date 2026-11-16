<script setup lang="ts">
import type { Contribution } from '~~/server/api/contributions.get'

const { github } = useAppConfig()

const { data: pullRequests } = await useFetch('/api/contributions', { key: 'contributions' })
const { data: descriptions } = await useFetch('/api/repositories', { key: 'repositories' })

const all = computed(() => pullRequests.value ?? [])
const merged = computed(() => all.value.filter(pr => pr.state === 'merged').length)

function years(prs: Contribution[]): string {
  const sorted = prs.map(pr => pr.date.slice(0, 4)).sort()
  const first = sorted[0]
  const last = sorted.at(-1)
  return first === last ? `${first}` : `${first} – ${last}`
}

const projects = computed(() => {
  const byRepo = new Map<string, Contribution[]>()
  for (const pr of all.value) byRepo.set(pr.repo, [...(byRepo.get(pr.repo) ?? []), pr])
  return [...byRepo]
    .map(([repo, prs]) => {
      const [owner, name] = repo.split('/') as [string, string]
      const mergedCount = prs.filter(pr => pr.state === 'merged').length
      const counts = [
        mergedCount && `${mergedCount} merged`,
        prs.length - mergedCount && `${prs.length - mergedCount} open`,
      ].filter(Boolean)
      return {
        repo,
        owner,
        name,
        prs,
        description: descriptions.value?.[repo],
        meta: [...counts, years(prs)].join(' · '),
      }
    })
    .sort((a, b) => b.prs.length - a.prs.length)
})

const caption = computed(() => {
  const count = projects.value.length
  return `${count} ${count === 1 ? 'project' : 'projects'} · ${years(all.value)}`
})

const githubQuery = [
  `is:pr is:public author:${github.username} -user:${github.username}`,
  ...github.hidden.filter(entry => !entry.includes('#')).map(repo => `-repo:${repo}`),
].join(' ')
const githubUrl = `https://github.com/search?type=pullrequests&q=${encodeURIComponent(githubQuery)}`

useSeoMeta({
  title: 'Open source',
  description: 'Open source pull requests by Nikita Rusetskii.',
})

defineOgImage({
  title: 'Open source',
  description: 'Open source pull requests by Nikita Rusetskii.',
})
</script>

<template>
  <div>
    <h1 class="hd">
      <span class="vt-oss-label">Open source</span>
      <OpenSourceCount v-if="projects.length" :merged="merged" :open="all.length - merged" compact />
    </h1>

    <template v-if="projects.length">
      <p class="caption vt-oss-caption">{{ caption }}</p>

      <section class="sec" aria-labelledby="oss-prs">
        <div class="sec-head vt-oss-head">
          <h2 id="oss-prs" class="label">Pull requests</h2>
          <a :href="githubUrl" target="_blank" rel="noopener noreferrer" class="all">All on GitHub ↗</a>
        </div>

        <ol>
          <li v-for="project in projects" :key="project.repo" class="tl-co vt-oss-project">
            <img
              :src="`https://github.com/${project.owner}.png?size=72`"
              alt=""
              width="36"
              height="36"
              class="tl-logo"
            >
            <div class="head">
              <h3 class="tl-name">
                <a :href="`https://github.com/${project.repo}`" target="_blank" rel="noopener noreferrer">{{ project.name }}</a>
              </h3>
              <span class="row-meta">{{ project.meta }}</span>
            </div>
            <p class="tl-sub">
              {{ project.owner }}<template v-if="project.description"> · {{ project.description }}</template>
            </p>
            <ul class="prs">
              <li v-for="pr in project.prs" :key="pr.url" class="pr">
                <span class="pr-icon">
                  <Icon v-if="pr.state === 'open'" name="ph:git-pull-request" size="16" style="color: var(--open);" />
                  <Icon v-else name="ph:git-merge" size="16" style="color: var(--merged);" />
                </span>
                <a :href="pr.url" target="_blank" rel="noopener noreferrer" class="pr-link">
                  <span class="pr-title">{{ plainPullRequestTitle(pr.title) }}<span class="sr-only"> ({{ pr.state === 'open' ? 'open' : 'merged' }})</span></span>
                  <span class="row-meta">#{{ pr.number }}</span>
                </a>
              </li>
            </ul>
          </li>
        </ol>
      </section>
    </template>

    <p v-else class="empty">
      <a :href="githubUrl" target="_blank" rel="noopener noreferrer">Pull requests on GitHub ↗</a>
    </p>
  </div>
</template>

<style scoped>
/* flex-start keeps the label and count as wide as their text, the size the view transition scales from the door */
.hd {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: normal;
  color: var(--heading);
}

.caption {
  margin-top: 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
}

.sec {
  margin-top: 3rem;
}

.sec-head {
  padding-top: 1rem;
  border-top: 1px solid var(--border-strong);
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.label {
  font-size: 0.8125rem;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 0;
  color: var(--heading);
}

.all {
  font-size: 0.8125rem;
  color: var(--text-muted);
  white-space: nowrap;
}

.tl-co {
  position: relative;
  padding-left: 56px;
}

.tl-co + .tl-co {
  margin-top: 2.5rem;
}

.tl-co::before {
  content: '';
  position: absolute;
  left: 17.5px;
  top: 36px;
  bottom: -2.5rem;
  width: 1px;
  background: var(--border-strong);
}

.tl-co:last-child::before {
  bottom: 0;
}

.tl-co:last-child .pr:last-child::after {
  content: '';
  position: absolute;
  left: -40px;
  top: 11px;
  bottom: 0;
  width: 4px;
  background: var(--bg);
}

.tl-logo {
  position: absolute;
  left: 0;
  top: -6px;
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: var(--surface);
  box-shadow: 0 0 0 1px var(--border);
}

.head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: 0 1rem;
}

.tl-name {
  font-size: 17px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0;
}

.tl-name a {
  text-decoration: none;
}

.tl-sub {
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text-muted);
}

.prs {
  margin-top: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.pr {
  position: relative;
}

.pr-icon {
  position: absolute;
  z-index: 1;
  left: -48.5px;
  top: 1px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--bg);
}

.pr-link {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  line-height: 1.5;
  color: var(--heading);
  text-decoration: none;
}

.pr-link:hover .pr-title {
  text-decoration: underline;
  text-decoration-color: var(--link-underline);
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.pr-title {
  min-width: 0;
}

.empty {
  margin-top: 1rem;
  color: var(--text-muted);
}
</style>
