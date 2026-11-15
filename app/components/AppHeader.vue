<script setup lang="ts">
const { profile } = useAppConfig()
const route = useRoute()
const isHome = computed(() => route.path === '/')
</script>

<template>
  <header class="site-header w-full max-w-2xl mx-auto px-5 pt-6 sm:pt-10 flex items-center justify-between gap-4">
    <h1 v-if="isHome" class="home-link">
      <img :src="profile.avatar" alt="" width="28" height="28" class="avatar">
      <span>{{ profile.name }}</span>
    </h1>
    <NuxtLink v-else to="/" class="home-link">
      <img :src="profile.avatar" alt="" width="28" height="28" class="avatar">
      <span>{{ profile.name }}</span>
    </NuxtLink>

    <ThemeToggle />
  </header>
</template>

<style scoped>
.home-link {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--heading);
  text-decoration: none;
}

a.home-link:hover {
  color: var(--heading);
  opacity: 0.8;
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  box-shadow: 0 0 0 1px var(--border);
}
</style>
