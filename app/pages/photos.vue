<script setup lang="ts">
const { groups, all } = usePhotos()

useSeoMeta({
  title: 'Photos',
  description: 'Photos by Nikita Rusetskii.',
})

defineOgImage({
  title: 'Photos',
  description: 'Photos by Nikita Rusetskii.',
})
</script>

<template>
  <div>
    <h1 class="page-title">Photos</h1>
    <p class="page-subtitle">{{ all.length }} photos</p>

    <PhotoGallery :groups="groups" class="mt-8" />
  </div>
</template>
