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
    <h1 class="page-title"><span class="vt-photos-label">Photos</span></h1>
    <p class="page-subtitle vt-photos-caption">{{ all.length }} photos</p>

    <PhotoGallery :groups="groups" class="mt-8" />
  </div>
</template>
