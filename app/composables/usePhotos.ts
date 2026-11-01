import data from '~/data/photos.json'

export interface Photo {
  name: string
  caption: string
  alt: string
  /** Size of the large version; the thumbnail has the same aspect ratio */
  width: number
  height: number
  featured?: boolean
  /** object-position for the 3:4 tile crop, e.g. "70% 50%" */
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
  const featured = all.filter(photo => photo.featured)
  return { groups, all, featured }
}
