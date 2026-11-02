<script setup lang="ts">
import type { Contribution } from '~~/server/api/contributions.get'

defineProps<{ pr: Contribution }>()
</script>

<template>
  <li>
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
          <Icon v-if="pr.state === 'open'" name="ph:git-pull-request" size="18" style="color: var(--open);" />
          <Icon v-else name="ph:git-merge" size="18" style="color: var(--merged);" />
          <span class="sr-only">{{ pr.state === 'open' ? 'Open' : 'Merged' }}</span>
        </span>
      </div>
    </a>
  </li>
</template>

<style scoped>
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
  flex-shrink: 0;
}
</style>
