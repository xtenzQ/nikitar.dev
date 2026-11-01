<script setup lang="ts">
const route = useRoute()
const isHome = computed(() => route.path === '/')
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader v-if="!isHome" />
    <main
      class="flex-1 w-full max-w-2xl mx-auto px-5 pb-12"
      :class="isHome ? 'pt-14 sm:pt-20' : 'pt-10'"
    >
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
