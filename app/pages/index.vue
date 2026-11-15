<script setup lang="ts">
const { profile, socials } = useAppConfig()
const { all: allPhotos, featured } = usePhotos()

const { data: openSource } = await useFetch('/api/contributions', {
  key: 'contributions-home',
  transform: (all) => {
    const counts = new Map<string, number>()
    for (const pr of all) counts.set(pr.repo, (counts.get(pr.repo) ?? 0) + 1)
    // Stable sort: equal counts keep the route's order, newest first
    const repos = [...counts]
      .map(([repo, count]) => ({ name: repo.split('/')[1]!, count }))
      .sort((a, b) => b.count - a.count)
    return {
      merged: all.filter(pr => pr.state === 'merged').length,
      open: all.filter(pr => pr.state === 'open').length,
      repos,
    }
  },
})

const repoCaption = computed(() => {
  const repos = openSource.value?.repos ?? []
  const shown = repos.slice(0, 4).map(repo => `${repo.name} ${repo.count}`)
  if (repos.length > 4) shown.push(`+${repos.length - 4}`)
  return shown.join(' · ')
})

const thumbs = featured.slice(0, 2)

useHead({
  titleTemplate: '%s',
})

const description = 'Software engineer at KMS Lighthouse in Belgrade. Solr-based search, Lucene internals, RAG, and agent harnesses for software engineering.'

useSeoMeta({
  title: profile.name,
  description,
})

defineOgImage({
  title: profile.name,
  description,
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
    <!-- The GitHub profile README repeats the work and interests sentences -->
    <div class="statement">
      <p>
        Software engineer at
        <a href="https://kmslh.com/" target="_blank" rel="noopener noreferrer">KMS Lighthouse</a>,
        based in Belgrade. I work on Solr-based search and build AI tooling for our R&amp;D team.
      </p>
      <p class="statement-muted">
        Interested in search architecture, Lucene internals, RAG, and agent harnesses for software engineering.
      </p>
    </div>

    <div v-if="profile.status" class="status">
      <StatusPill :label="profile.status.label" />
      <p class="status-note">{{ profile.status.note }}</p>
    </div>

    <nav aria-label="Elsewhere" class="links">
      <a
        v-for="social in socials"
        :key="social.label"
        :href="social.url"
        :target="social.url.startsWith('mailto:') ? undefined : '_blank'"
        rel="noopener noreferrer"
      >{{ social.label }}</a>
    </nav>

    <div class="doors">
      <section v-if="openSource?.repos.length" class="door" aria-labelledby="door-oss">
        <NuxtLink id="door-oss" to="/oss" class="door-link">
          Open source <span class="door-arrow" aria-hidden="true">→</span>
        </NuxtLink>
        <p class="door-visual">
          <span class="door-number">{{ openSource.merged }}</span>
          <span class="door-unit">merged<template v-if="openSource.open"> · {{ openSource.open }} open</template></span>
        </p>
        <p class="door-caption">{{ repoCaption }}</p>
      </section>

      <section v-if="thumbs.length" class="door" aria-labelledby="door-photos">
        <NuxtLink id="door-photos" to="/photos" class="door-link">
          Photos <span class="door-arrow" aria-hidden="true">→</span>
        </NuxtLink>
        <div class="door-visual">
          <img
            v-for="photo in thumbs"
            :key="photo.name"
            :src="`/photos/${photo.name}.webp`"
            alt=""
            :style="{ objectPosition: photo.focus }"
            width="84"
            height="112"
            decoding="async"
          >
        </div>
        <p class="door-caption">{{ allPhotos.length }} photos</p>
      </section>
    </div>
  </div>
</template>

<style scoped>
.statement {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: clamp(1.375rem, 1.1rem + 1.2vw, 1.75rem);
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -0.02em;
  color: var(--heading);
  text-wrap: pretty;
}

.statement-muted {
  color: var(--text-muted);
}

.status {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
}

.status-note {
  flex: 1 1 18rem;
  min-width: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-muted);
}

.links {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0 1.25rem;
}

.links a {
  padding-block: 0.25rem;
  color: var(--heading);
}

.doors {
  margin-top: 3.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
  gap: 2rem;
}

.door {
  position: relative;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  padding-top: 0.875rem;
  border-top: 1px solid var(--border-strong);
}

.door-link {
  align-self: flex-start;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--heading);
  text-decoration: none;
}

/* The whole door is the link's click target */
.door-link::after {
  content: '';
  position: absolute;
  inset: 0;
}

.door-arrow {
  display: inline-block;
  transition: transform 0.15s ease;
}

.door:hover .door-arrow {
  transform: translateX(2px);
}

.door-visual {
  height: 112px;
  display: flex;
  align-items: flex-end;
  gap: 0.375rem;
}

.door-number {
  font-size: 4rem;
  font-weight: 600;
  line-height: 0.9;
  letter-spacing: -0.04em;
  color: var(--heading);
  font-variant-numeric: tabular-nums;
}

.door-unit {
  margin-left: 0.25rem;
  padding-bottom: 0.25rem;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.door-visual img {
  width: 84px;
  height: 112px;
  object-fit: cover;
  border-radius: 8px;
  background: var(--surface);
  outline: 1px solid var(--border);
  outline-offset: -1px;
  transition: opacity 0.15s ease;
}

.door:hover .door-visual img {
  opacity: 0.9;
}

.door-caption {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Stacked doors don't need matching visual heights */
@media (max-width: 28.5rem) {
  .door-visual {
    height: auto;
  }
}
</style>
