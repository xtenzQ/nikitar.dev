<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<template>
  <span
    class="inline-block text-sm font-medium px-3 py-1 rounded-lg border"
    style="background: var(--badge-bg); color: var(--badge-text); border-color: var(--border);"
  >
    {{ label }}
  </span>
</template>
