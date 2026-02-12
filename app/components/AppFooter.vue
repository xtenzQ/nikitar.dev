<template>
  <footer class="border-t" style="border-color: var(--border);">
    <div class="max-w-4xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-sm" style="color: var(--text-muted);">&copy; {{ new Date().getFullYear() }} Nikita Rusetskii</p>
      <SocialLinks />
    </div>
  </footer>
</template>
