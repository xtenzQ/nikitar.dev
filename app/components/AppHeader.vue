<script setup lang="ts">
const route = useRoute()
const colorMode = useColorMode()
const mobileMenuOpen = ref(false)

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

function navColor(path: string): string {
  if (path === '/blog') {
    return route.path.startsWith('/blog') && !route.path.startsWith('/blog/tags')
      ? 'var(--heading)' : 'var(--text-muted)'
  }
  return route.path.startsWith(path) ? 'var(--heading)' : 'var(--text-muted)'
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function onClickOutside(e: Event) {
  const header = (e.target as HTMLElement).closest('header')
  if (!header) closeMobileMenu()
}

watch(mobileMenuOpen, (open) => {
  if (open) {
    document.addEventListener('click', onClickOutside)
  } else {
    document.removeEventListener('click', onClickOutside)
  }
})

watch(route, () => {
  closeMobileMenu()
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<template>
  <header class="sticky top-0 z-50 backdrop-blur border-b" style="background: var(--header-bg); border-color: var(--border);">
    <nav class="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
      <NuxtLink to="/" class="text-lg font-semibold transition-colors" style="color: var(--heading);">
        nikitar.dev
      </NuxtLink>

      <!-- Desktop nav -->
      <div class="hidden md:flex items-center gap-6">
        <NuxtLink to="/blog" class="text-sm font-medium transition-colors" :style="{ color: navColor('/blog') }">
          Blog
        </NuxtLink>
        <NuxtLink to="/blog/tags" class="text-sm font-medium transition-colors" :style="{ color: navColor('/blog/tags') }">
          Tags
        </NuxtLink>
        <NuxtLink to="/about" class="text-sm font-medium transition-colors" :style="{ color: navColor('/about') }">
          About
        </NuxtLink>
        <button
          aria-label="Toggle dark mode"
          class="flex items-center justify-center w-9 h-9 rounded-md transition-colors hover:opacity-80 theme-toggle"
          @click="toggleTheme"
        >
          <Icon class="icon-light block" name="mdi:weather-night" size="20" />
          <Icon class="icon-dark block" name="mdi:weather-sunny" size="20" />
        </button>
      </div>

      <!-- Mobile: theme toggle + hamburger -->
      <div class="flex md:hidden items-center gap-2">
        <button
          aria-label="Toggle dark mode"
          class="flex items-center justify-center w-9 h-9 rounded-md transition-colors hover:opacity-80 theme-toggle"
          @click="toggleTheme"
        >
          <Icon class="icon-light block" name="mdi:weather-night" size="20" />
          <Icon class="icon-dark block" name="mdi:weather-sunny" size="20" />
        </button>
        <button
          aria-label="Toggle menu"
          class="burger-toggle flex items-center justify-center w-9 h-9 rounded-md transition-colors hover:opacity-80"
          :class="{ open: mobileMenuOpen }"
          style="color: var(--text-muted);"
          @click.stop="mobileMenuOpen = !mobileMenuOpen"
        >
          <Icon class="burger-icon" name="mdi:menu" size="22" />
          <Icon class="close-icon" name="mdi:close" size="22" />
        </button>
      </div>
    </nav>

    <!-- Mobile dropdown menu -->
    <div
      class="mobile-menu md:hidden overflow-hidden"
      :class="{ open: mobileMenuOpen }"
      style="border-color: var(--border);"
    >
      <div class="max-w-4xl mx-auto px-6 py-3 flex flex-col gap-1">
        <NuxtLink
          to="/blog"
          class="mobile-nav-link text-sm font-medium transition-colors py-2 px-2 rounded-md"
          :style="{ color: navColor('/blog') }"
          @click="closeMobileMenu"
        >
          Blog
        </NuxtLink>
        <NuxtLink
          to="/blog/tags"
          class="mobile-nav-link text-sm font-medium transition-colors py-2 px-2 rounded-md"
          :style="{ color: navColor('/blog/tags') }"
          @click="closeMobileMenu"
        >
          Tags
        </NuxtLink>
        <NuxtLink
          to="/about"
          class="mobile-nav-link text-sm font-medium transition-colors py-2 px-2 rounded-md"
          :style="{ color: navColor('/about') }"
          @click="closeMobileMenu"
        >
          About
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<style scoped>
.mobile-menu {
  max-height: 0;
  transition: max-height 0.3s ease, opacity 0.3s ease;
  opacity: 0;
}

.mobile-menu.open {
  max-height: 200px;
  opacity: 1;
}

.mobile-nav-link:hover {
  background: var(--hover-bg, rgba(128, 128, 128, 0.1));
}

.burger-toggle .close-icon {
  display: none;
}

.burger-toggle.open .burger-icon {
  display: none;
}

.burger-toggle.open .close-icon {
  display: block;
}
</style>
