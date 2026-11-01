<script setup lang="ts">
defineProps<{
  posts: { path: string, title: string, description: string, date: string }[]
}>()
</script>

<template>
  <ul class="group">
    <li v-for="post in posts" :key="post.path">
      <NuxtLink :to="post.path" class="group-row">
        <div class="group-row-body items-start!">
          <div class="row-text">
            <div class="row-title">{{ post.title }}</div>
            <div class="row-subtitle line-clamp-2">{{ post.description }}</div>
          </div>
          <time class="row-meta mt-0.5" :datetime="post.date">{{ formatDate(post.date) }}</time>
        </div>
      </NuxtLink>
    </li>
  </ul>
</template>
