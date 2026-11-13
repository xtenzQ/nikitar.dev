<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  description?: string
}>(), {
  title: 'Nikita Rusetskii',
  description: '',
})

const { profile } = useAppConfig()
</script>

<template>
  <div
    class="w-full h-full flex flex-col justify-between"
    style="padding: 72px 80px; background-color: #f5f5f7;"
  >
    <div class="flex items-center">
      <img
        :src="profile.avatar"
        width="64"
        height="64"
        style="width: 64px; height: 64px; border-radius: 9999px;"
      >
      <span style="margin-left: 20px; font-size: 28px; color: #6e6e73;">nikitar.dev</span>
    </div>
    <div class="flex flex-col">
      <h1 style="margin: 0; font-size: 72px; font-weight: 700; line-height: 1.1; color: #1d1d1f;">
        {{ title }}
      </h1>
      <p
        v-if="description"
        style="margin: 24px 0 0; font-size: 34px; line-height: 1.4; color: #6e6e73; max-width: 1000px;"
      >
        {{ description }}
      </p>
    </div>
  </div>
</template>
