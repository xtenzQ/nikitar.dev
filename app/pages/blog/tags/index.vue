<script setup lang="ts">
const { data: posts } = await useAsyncData('tags-posts', () =>
  queryCollection('blog')
    .where('draft', '=', false)
    .all()
)

const tagCounts = computed(() => {
  const counts: Record<string, number> = {}
  for (const post of posts.value ?? []) {
    for (const tag of post.tags ?? []) {
      counts[tag] = (counts[tag] ?? 0) + 1
    }
  }
  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
})

useSeoMeta({
  title: 'Tags',
  description: 'Browse all tags on the blog.',
})

defineOgImage({
  title: 'Tags',
  description: 'Browse all tags on the blog.',
})
</script>

<template>
  <div>
    <h1 class="page-title">Tags</h1>
    <p class="page-subtitle">
      <NuxtLink to="/blog">All posts</NuxtLink>
    </p>

    <ul v-if="tagCounts.length" class="group mt-8">
      <li v-for="[tag, count] in tagCounts" :key="tag">
        <NuxtLink :to="`/blog/tags/${tag}`" class="group-row">
          <div class="group-row-body">
            <span class="row-text row-title">{{ tag }}</span>
            <span class="row-meta">{{ count }}</span>
            <Icon name="ph:caret-right" size="14" class="row-chevron" />
          </div>
        </NuxtLink>
      </li>
    </ul>

    <p v-else class="mt-8" style="color: var(--text-muted);">No tags yet.</p>
  </div>
</template>
