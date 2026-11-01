<script setup lang="ts">
const { profile } = useAppConfig()
</script>

<template>
  <header class="w-full max-w-2xl mx-auto px-5 pt-6 flex items-center justify-between gap-4">
    <NuxtLink to="/" class="home-link">
      <img :src="profile.avatar" alt="" width="24" height="24" class="avatar">
      <span>{{ profile.name }}</span>
    </NuxtLink>

    <ThemeToggle />
  </header>
</template>

<style scoped>
.home-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--heading);
}

.home-link:hover {
  color: var(--heading);
  text-decoration: none;
  opacity: 0.8;
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  box-shadow: 0 0 0 1px var(--border);
}
</style>
