<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <span class="pill"><span class="dot" aria-hidden="true" />{{ label }}</span>
</template>

<style scoped>
.pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 28px;
  padding: 0 0.75rem 0 0.625rem;
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  background: var(--surface);
  color: var(--heading);
  font-size: 0.8125rem;
  font-weight: 600;
  white-space: nowrap;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--open);
}
</style>
