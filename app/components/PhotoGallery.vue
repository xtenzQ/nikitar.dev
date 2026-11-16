<script setup lang="ts">
import type { Photo } from '~/composables/usePhotos'

const props = defineProps<{
  groups: { title?: string, photos: Photo[] }[]
}>()

const { door } = usePhotos()
function doorClass(name: string) {
  const i = door.findIndex(photo => photo.name === name)
  return i < 0 ? undefined : `vt-photo-${i + 1}`
}

const photos = computed(() => props.groups.flatMap(group => group.photos))
const offsets = computed(() => props.groups.map((_, i) =>
  props.groups.slice(0, i).reduce((sum, group) => sum + group.photos.length, 0)))

const dialog = ref<HTMLDialogElement>()
const isOpen = ref(false)
const current = ref(0)
const photo = computed(() => photos.value[current.value]!)

function open(index: number) {
  current.value = index
  isOpen.value = true
  dialog.value?.showModal()
}

function close() {
  dialog.value?.close()
}

function step(delta: number) {
  const count = photos.value.length
  current.value = (current.value + delta + count) % count
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') step(1)
  else if (e.key === 'ArrowLeft') step(-1)
}

function onClick(e: MouseEvent) {
  if (e.target === dialog.value) close()
}

let touchStartX = 0

function onTouchStart(e: TouchEvent) {
  touchStartX = e.changedTouches[0]!.clientX
}

function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0]!.clientX - touchStartX
  if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1)
}
</script>

<template>
  <div>
    <section v-for="(group, g) in groups" :key="group.title ?? g" :class="{ 'mt-10': g > 0 }">
      <h2 v-if="group.title" class="section-label">{{ group.title }}</h2>
      <ul class="photos">
        <li v-for="(item, i) in group.photos" :key="item.name">
          <figure>
            <button type="button" class="photo-btn" :aria-label="`Open photo: ${item.caption}`" @click="open(offsets[g]! + i)">
              <img
                :src="`/photos/${item.name}.webp`"
                :alt="item.alt"
                :class="doorClass(item.name)"
                :style="{ objectPosition: item.focus }"
                width="600"
                height="800"
                loading="lazy"
                decoding="async"
              >
            </button>
            <figcaption>{{ item.caption }}</figcaption>
          </figure>
        </li>
      </ul>
    </section>

    <dialog
      ref="dialog"
      class="lightbox"
      aria-label="Photo viewer"
      @close="isOpen = false"
      @click="onClick"
      @keydown="onKeydown"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <button type="button" class="icon-btn lightbox-close" aria-label="Close" autofocus @click="close">
        <Icon name="ph:x" size="16" />
      </button>

      <figure v-if="isOpen" class="lightbox-figure">
        <img
          :key="photo.name"
          :src="`/photos/${photo.name}-large.webp`"
          :alt="photo.alt"
          :width="photo.width"
          :height="photo.height"
          :style="{ backgroundImage: `url(/photos/${photo.name}.webp)` }"
        >
        <figcaption class="lightbox-caption">
          <span>{{ photo.caption }}</span>
          <span class="flex items-center gap-1.5">
            <span class="lightbox-count">{{ current + 1 }} / {{ photos.length }}</span>
            <button type="button" class="icon-btn" aria-label="Previous photo" @click="step(-1)">
              <Icon name="ph:caret-left" size="16" />
            </button>
            <button type="button" class="icon-btn" aria-label="Next photo" @click="step(1)">
              <Icon name="ph:caret-right" size="16" />
            </button>
          </span>
        </figcaption>
      </figure>
    </dialog>
  </div>
</template>

<style scoped>
.photos {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
}

@media (min-width: 640px) {
  .photos {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.photo-btn {
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  background: none;
  border-radius: 12px;
  cursor: zoom-in;
}

.photos img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border-radius: 12px;
  background: var(--surface);
  outline: 1px solid var(--border);
  outline-offset: -1px;
  transition: opacity 0.15s ease;
}

.photo-btn:hover img {
  opacity: 0.9;
}

.photos figcaption {
  margin-top: 0.375rem;
  margin-bottom: 0.25rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* ── Viewer ──────────────────────────────────────────────── */
.lightbox {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 3.5rem 1rem 1.5rem;
  border: 0;
  background: transparent;
  color: rgb(255 255 255 / 0.75);
}

.lightbox[open] {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: lightbox-in 0.15s ease;
}

.lightbox::backdrop {
  background: rgb(0 0 0 / 0.7);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
}

.lightbox-close {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
}

.lightbox-figure {
  display: flex;
  flex-direction: column;
  max-width: 100%;
}

.lightbox-figure img {
  display: block;
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: calc(100dvh - 9rem);
  border-radius: 12px;
  background-size: cover;
}

.lightbox-caption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

.lightbox-count {
  margin-right: 0.25rem;
  color: rgb(255 255 255 / 0.5);
}

@keyframes lightbox-in {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: none; }
}
</style>
