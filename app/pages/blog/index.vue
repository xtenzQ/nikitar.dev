<script setup lang="ts">
const { data: posts } = await useAsyncData('all-posts', () =>
  queryCollection('blog')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .all()
)

useSeoMeta({
  title: 'Writing',
  description: 'Articles on software engineering, search, and AI by Nikita Rusetskii.',
})

defineOgImage({
  component: 'NuxtSeo',
  title: 'Writing',
  description: 'Articles on software engineering, search, and AI.',
})
</script>

<template>
  <div>
    <h1 class="page-title">Writing</h1>
    <p class="page-subtitle">
      {{ posts?.length ?? 0 }} {{ posts?.length === 1 ? 'post' : 'posts' }} ·
      <NuxtLink to="/blog/tags">Browse by tag</NuxtLink>
    </p>

    <PostList v-if="posts?.length" :posts="posts" class="mt-8" />
    <p v-else class="mt-8" style="color: var(--text-muted);">No posts yet.</p>
  </div>
</template>
