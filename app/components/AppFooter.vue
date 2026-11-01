<template>
  <footer class="w-full max-w-2xl mx-auto px-5 py-10 flex items-center justify-between gap-4 text-[0.8125rem]" style="color: var(--text-muted);">
    <p>&copy; {{ new Date().getFullYear() }} Nikita Rusetskii</p>
    <a href="https://github.com/xtenzQ/nikitar.dev" target="_blank" rel="noopener noreferrer" class="footer-link">Source</a>
  </footer>
</template>

<style scoped>
.footer-link {
  color: var(--text-muted);
}

.footer-link:hover {
  color: var(--heading);
}
</style>
