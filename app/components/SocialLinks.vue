<script setup lang="ts">
const { socials } = useAppConfig()
</script>

<template>
  <nav aria-label="Elsewhere" class="items-center gap-1.5">
    <a
      v-for="social in socials"
      :key="social.label"
      :href="social.url"
      :aria-label="social.label"
      :title="social.label"
      :target="social.url.startsWith('mailto:') ? undefined : '_blank'"
      rel="noopener noreferrer"
      class="icon-btn"
    >
      <Icon :name="social.icon" size="16" />
    </a>
  </nav>
</template>
