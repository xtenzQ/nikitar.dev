<script setup lang="ts">
const props = defineProps<{ id?: string }>()
</script>

<template>
  <h2 :id="props.id" class="heading-anchor">
    <a
      v-if="props.id"
      :href="`#${props.id}`"
      class="anchor-link"
      aria-hidden="true"
    >#</a>
    <slot />
  </h2>
</template>
