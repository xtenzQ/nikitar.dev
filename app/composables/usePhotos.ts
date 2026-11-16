import data from '~/data/photos.json'

export interface Photo {
  name: string
  caption: string
  alt: string
  width: number
  height: number
  featured?: boolean
  focus?: string
}

export interface PhotoGroup {
  id: string
  title: string
  photos: Photo[]
}

export function usePhotos() {
  const groups = data.groups as PhotoGroup[]
  const all = groups.flatMap(group => group.photos)
  const door = all.filter(photo => photo.featured).slice(0, 2)
  return { groups, all, door }
}
