<script setup lang="ts">
const { profile, github } = useAppConfig()
const { all: allPhotos, featured } = usePhotos()

const { data: contributions } = await useFetch('/api/contributions', { key: 'contributions' })

const allContributionsUrl = `https://github.com/search?type=pullrequests&q=${encodeURIComponent(`is:pr author:${github.username} -user:${github.username}`)}`

useHead({
  titleTemplate: '%s',
})

useSeoMeta({
  title: profile.name,
  description: 'Software engineer at KMS Lighthouse in Belgrade. Solr-based search, Lucene internals, RAG, and agent harnesses for software engineering.',
})

defineOgImage({
  component: 'NuxtSeo',
  title: profile.name,
  description: 'Search, Lucene, RAG, and agent tooling',
})

useSchemaOrg([
  definePerson({
    name: profile.name,
    url: 'https://nikitar.dev',
    jobTitle: 'Software Engineer',
    sameAs: [
      'https://github.com/xtenzQ',
      'https://www.linkedin.com/in/xtenzq/',
      'https://scholar.google.com/citations?user=qy3ZD4IAAAAJ&hl=en',
    ],
  }),
])
</script>

<template>
  <div>
    <header class="flex items-center gap-4">
      <img :src="profile.avatar" alt="" width="44" height="44" class="avatar">
      <div class="flex-1 min-w-0">
        <h1 class="name">{{ profile.name }}</h1>
        <p class="role">{{ profile.role }} · {{ profile.location }}</p>
      </div>
      <div class="flex items-center gap-1.5">
        <SocialLinks class="hidden sm:flex" />
        <ThemeToggle />
      </div>
    </header>

    <!-- Same text as the GitHub profile README -->
    <div class="bio">
      <p>
        Software engineer at
        <a href="https://kmslh.com/" target="_blank" rel="noopener noreferrer">KMS Lighthouse</a>,
        based in Belgrade. I work on Solr-based search and build AI tooling for our R&amp;D team.
      </p>
      <p>
        Interested in search architecture, Lucene internals, RAG, and agent harnesses for software engineering.
      </p>
      <p class="muted">
        Before moving to Serbia in 2023, I was a PhD student supervised by
        <a href="https://scholar.google.com/citations?user=qKyxsuIAAAAJ&hl=en" target="_blank" rel="noopener noreferrer">Denis Sidorov</a>,
        working on optimization and ML methods for power systems in collaboration with the Intelligent Power Grid Lab at Inha University.
      </p>
      <p class="muted">
        Two-time 3rd-place winner of the SI Analytics satellite imagery track at JunctionX Seoul:
        <a href="https://github.com/daredevils-team/SmartMonitor" target="_blank" rel="noopener noreferrer">SmartMonitor</a> (2020),
        <a href="https://github.com/daredevils-team/SmartChange" target="_blank" rel="noopener noreferrer">SmartChange</a> (2021).
      </p>
    </div>

    <SocialLinks class="flex sm:hidden mt-5" />

    <section v-if="contributions?.pullRequests.length" class="mt-10">
      <div class="section-head">
        <h2 class="section-label">Open source</h2>
        <p class="section-meta">
          <span v-if="contributions.merged">
            <span class="dot" style="background: var(--merged);" />{{ contributions.merged }} merged
          </span>
          <span v-if="contributions.open">
            <span class="dot" style="background: var(--open);" />{{ contributions.open }} open
          </span>
        </p>
      </div>
      <ul class="group">
        <li v-for="pr in contributions.pullRequests" :key="pr.url">
          <a :href="pr.url" target="_blank" rel="noopener noreferrer" class="group-row">
            <img
              :src="`https://github.com/${pr.owner}.png?size=40`"
              alt=""
              width="20"
              height="20"
              loading="lazy"
              class="org-avatar"
            >
            <div class="group-row-body">
              <div class="row-text">
                <div class="row-title">{{ pr.title }}</div>
                <div class="row-subtitle mono">{{ pr.repo }} #{{ pr.number }}</div>
              </div>
              <span class="row-status">
                <span class="dot" :style="{ background: pr.state === 'open' ? 'var(--open)' : 'var(--merged)' }" />
                <span class="sr-only sm:not-sr-only">{{ pr.state === 'open' ? 'Open' : 'Merged' }}</span>
              </span>
            </div>
          </a>
        </li>
        <li>
          <a :href="allContributionsUrl" target="_blank" rel="noopener noreferrer" class="group-row">
            <Icon name="ph:github-logo" size="20" class="row-chevron" />
            <div class="group-row-body">
              <span class="row-text" style="color: var(--text-muted);">All pull requests on GitHub</span>
              <Icon name="ph:arrow-up-right" size="14" class="row-chevron" />
            </div>
          </a>
        </li>
      </ul>
    </section>

    <section v-if="featured.length" class="mt-10" aria-label="Photos">
      <PhotoGallery :groups="[{ photos: featured }]" />
      <ul v-if="allPhotos.length > featured.length" class="group mt-4">
        <li>
          <NuxtLink to="/photos" class="group-row">
            <Icon name="ph:images" size="20" class="row-chevron" />
            <div class="group-row-body">
              <span class="row-text" style="color: var(--text-muted);">All {{ allPhotos.length }} photos</span>
              <Icon name="ph:caret-right" size="14" class="row-chevron" />
            </div>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 0 1px var(--border);
}

.name {
  font-size: 1.0625rem;
  line-height: 1.3;
}

.role {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.bio {
  margin-top: 1.25rem;
  color: var(--text);
}

.bio p + p {
  margin-top: 0.75rem;
}

.bio .muted {
  color: var(--text-muted);
}

.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.section-head .section-label {
  margin: 0;
}

.section-meta {
  display: flex;
  gap: 0.75rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.section-meta > span {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  white-space: nowrap;
}

.org-avatar {
  width: 20px;
  height: 20px;
  border-radius: 5px;
  flex-shrink: 0;
  box-shadow: 0 0 0 1px var(--border);
}

.mono {
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

.row-status {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  flex-shrink: 0;
  font-size: 0.8125rem;
  color: var(--text-muted);
  white-space: nowrap;
}
</style>
