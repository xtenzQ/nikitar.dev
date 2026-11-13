<script setup lang="ts">
const { github } = useAppConfig()

const { data: pullRequests } = await useFetch('/api/contributions', { key: 'contributions' })

const selectedOwner = ref<string | null>(null)

const owners = computed(() => {
  const counts = new Map<string, number>()
  for (const pr of pullRequests.value ?? []) counts.set(pr.owner, (counts.get(pr.owner) ?? 0) + 1)
  return [...counts]
    .map(([login, count]) => ({ login, count }))
    .sort((a, b) => b.count - a.count || a.login.localeCompare(b.login, 'en', { sensitivity: 'base' }))
})

const shown = computed(() => {
  const all = pullRequests.value ?? []
  return selectedOwner.value ? all.filter(pr => pr.owner === selectedOwner.value) : all
})

function toggleOwner(login: string) {
  selectedOwner.value = selectedOwner.value === login ? null : login
}

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
    <h1 class="page-title">Open source</h1>
    <p class="page-subtitle" aria-live="polite">
      <template v-if="selectedOwner">{{ shown.length }} of </template>{{ pullRequests?.length ?? 0 }} pull requests
    </p>

    <div v-if="owners.length > 1" class="chips mt-6" role="group" aria-label="Filter by organization">
      <button
        v-for="owner in owners"
        :key="owner.login"
        type="button"
        class="chip"
        :aria-pressed="selectedOwner === owner.login"
        @click="toggleOwner(owner.login)"
      >
        <img
          :src="`https://github.com/${owner.login}.png?size=40`"
          alt=""
          width="20"
          height="20"
          class="chip-avatar"
        >
        <span>@{{ owner.login }}</span>
        <span class="chip-count">{{ owner.count }}</span>
      </button>
    </div>

    <ul class="group" :class="owners.length > 1 ? 'mt-3' : 'mt-8'">
      <PullRequestRow v-for="pr in shown" :key="pr.url" :pr="pr" />
      <li>
        <a :href="githubUrl" target="_blank" rel="noopener noreferrer" class="group-row">
          <Icon name="ph:github-logo" size="20" class="row-chevron" />
          <div class="group-row-body">
            <span class="row-text" style="color: var(--text-muted);">All pull requests on GitHub</span>
            <Icon name="ph:arrow-up-right" size="14" class="row-chevron" />
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 32px;
  padding: 0 0.625rem 0 0.375rem;
  border: 1px solid var(--border-strong);
  border-radius: 8px;
  background: var(--surface);
  color: var(--heading);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.chip:hover {
  background: var(--surface-hover);
}

.chip[aria-pressed='true'] {
  border-color: var(--heading);
}

.chip-avatar {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  flex-shrink: 0;
  box-shadow: 0 0 0 1px var(--border);
}

.chip-count {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--text-muted);
}
</style>
