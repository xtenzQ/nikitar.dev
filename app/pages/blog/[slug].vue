<script setup lang="ts">
const route = useRoute()
const { data: post } = await useAsyncData(`blog-${route.params.slug}`, () =>
  queryCollection('blog').path(`/blog/${route.params.slug}`).first()
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}

const readingTime = computed(() => {
  if (!post.value?.rawbody) return '1 min read'
  const words = post.value.rawbody.split(/\s+/).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min read`
})

useSeoMeta({
  title: post.value.title,
  description: post.value.description,
  ogType: 'article',
  articlePublishedTime: post.value.date,
  articleTag: post.value.tags,
})

defineOgImage({
  title: post.value.title,
  description: post.value.description,
})

useSchemaOrg([
  defineArticle({
    '@type': 'BlogPosting',
    'headline': post.value.title,
    'description': post.value.description,
    'datePublished': post.value.date,
    'author': {
      name: 'Nikita Rusetskii',
      url: 'https://nikitar.dev/',
    },
  }),
])
</script>

<template>
  <article v-if="post">
    <header class="post-header">
      <h1 class="post-title">{{ post.title }}</h1>
      <p class="post-description">{{ post.description }}</p>
      <div class="post-meta">
        <time :datetime="post.date">{{ formatDate(post.date) }}</time>
        <span aria-hidden="true">·</span>
        <span>{{ readingTime }}</span>
      </div>
      <div v-if="post.tags?.length" class="flex flex-wrap gap-1.5 mt-4">
        <TagBadge v-for="tag in post.tags" :key="tag" :label="tag" />
      </div>
    </header>

    <div class="prose max-w-none">
      <ContentRenderer :value="post" />
    </div>
  </article>
</template>

<style scoped>
.post-header {
  padding-bottom: 2rem;
  margin-bottom: 2.5rem;
  border-bottom: 1px solid var(--border-strong);
}

.post-title {
  font-size: 2rem;
  line-height: 1.15;
  letter-spacing: -0.025em;
}

@media (min-width: 640px) {
  .post-title {
    font-size: 2.25rem;
  }
}

.post-description {
  margin-top: 0.75rem;
  font-size: 1.125rem;
  line-height: 1.5;
  color: var(--text-muted);
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.25rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
}
</style>
