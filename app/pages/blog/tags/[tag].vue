<script setup lang="ts">
const route = useRoute()
const tag = route.params.tag as string

const { data: posts } = await useAsyncData(`tag-${tag}`, () =>
  queryCollection('blog')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .all()
)

const filtered = computed(() =>
  (posts.value ?? []).filter(p => p.tags?.includes(tag))
)

useSeoMeta({
  title: `Tag: ${tag}`,
  description: `Posts tagged with "${tag}".`,
})

defineOgImage({
  title: `Tag: ${tag}`,
  description: `Posts tagged with "${tag}".`,
})
</script>

<template>
  <div>
    <h1 class="page-title">{{ tag }}</h1>
    <p class="page-subtitle">
      {{ filtered.length }} {{ filtered.length === 1 ? 'post' : 'posts' }} ·
      <NuxtLink to="/blog/tags">All tags</NuxtLink>
    </p>

    <PostList v-if="filtered.length" :posts="filtered" class="mt-8" />
    <p v-else class="mt-8" style="color: var(--text-muted);">No posts with this tag yet.</p>
  </div>
</template>
