<script setup lang="ts">
const { github } = useAppConfig()

const { data: pullRequests } = await useFetch('/api/contributions', { key: 'contributions' })

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
  component: 'NuxtSeo',
  title: 'Open source',
  description: 'Open source pull requests by Nikita Rusetskii.',
})
</script>

<template>
  <div>
    <h1 class="page-title">Open source</h1>
    <p class="page-subtitle">{{ pullRequests?.length ?? 0 }} pull requests</p>

    <ul class="group mt-8">
      <PullRequestRow v-for="pr in pullRequests" :key="pr.url" :pr="pr" />
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
