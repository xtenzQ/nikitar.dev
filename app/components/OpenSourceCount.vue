<script setup lang="ts">
defineProps<{ merged: number, open: number, compact?: boolean }>()
</script>

<template>
  <span class="count" :class="{ compact }">
    <span class="number vt-oss-number">{{ merged }}</span>
    <span class="unit vt-oss-unit">merged<template v-if="open"> · {{ open }} open</template></span>
  </span>
</template>

<style scoped>
.count {
  display: inline-flex;
  align-items: baseline;
  gap: 0.625rem;
}

/* Line-height and tracking stay in em, so the view transition scales the number between sizes without distortion */
.number {
  font-size: 4rem;
  font-weight: 600;
  line-height: 0.9;
  letter-spacing: -0.04em;
  color: var(--heading);
  font-variant-numeric: tabular-nums;
}

.unit {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.6;
  color: var(--text-muted);
}

.compact {
  gap: 0.5rem;
}

.compact .number {
  font-size: 2rem;
}

.compact .unit {
  font-size: 15px;
}
</style>
