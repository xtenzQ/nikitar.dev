<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <NuxtLink :to="`/blog/tags/${label}`" class="tag-badge" @click.stop>
    {{ label }}
  </NuxtLink>
</template>

<style scoped>
.tag-badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--border-strong);
  background: var(--surface);
  font-size: 0.8125rem;
  color: var(--text-muted);
  transition: color 0.15s ease, background-color 0.15s ease;
}

.tag-badge:hover {
  background: var(--surface-hover);
  color: var(--heading);
  text-decoration: none;
}
</style>
