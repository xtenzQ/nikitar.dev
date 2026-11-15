<script setup lang="ts">
const cv = useCv()
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="cv-bar w-full max-w-2xl mx-auto px-5 pt-6 sm:pt-10 flex items-center justify-between gap-4">
      <nav aria-label="Breadcrumb" class="crumbs">
        <NuxtLink to="/" class="crumb-home">nikitar.dev</NuxtLink>
        <span class="crumb-sep" aria-hidden="true">/</span>
        <span aria-current="page" class="crumb-here">cv</span>
      </nav>
      <ThemeToggle />
    </header>
    <main class="flex-1 w-full max-w-2xl mx-auto px-5 pb-12">
      <slot />
    </main>
    <AppFooter>· updated {{ cv.updated }}</AppFooter>
  </div>
</template>

<style scoped>
.crumbs {
  font-size: 15px;
}

.crumb-home {
  color: var(--text-muted);
  text-decoration: none;
}

.crumb-home:hover {
  color: var(--heading);
}

.crumb-sep {
  padding: 0 0.5rem;
  color: var(--text-tertiary);
}

.crumb-here {
  color: var(--heading);
}

@media print {
  .cv-bar,
  footer {
    display: none;
  }

  main {
    max-width: none;
    padding: 0;
  }
}
</style>
