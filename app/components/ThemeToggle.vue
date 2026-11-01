<script setup lang="ts">
const colorMode = useColorMode()

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button
    type="button"
    aria-label="Toggle dark mode"
    class="icon-btn theme-toggle cursor-pointer"
    @click="toggleTheme"
  >
    <Icon class="icon-light" name="ph:moon" size="16" />
    <Icon class="icon-dark" name="ph:sun" size="16" />
  </button>
</template>
