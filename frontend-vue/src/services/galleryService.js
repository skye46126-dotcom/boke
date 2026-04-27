import { isMock, supabase } from '@/lib/supabase'
import { galleryCategories, mockAlbums, mockPhotos } from '@/data/mockGallery'
import { apiRequest } from '@/lib/api'

export { galleryCategories }

const DEFAULT_CATEGORY = 'projects'
const DEFAULT_SORT_ORDER = 999

function normalizeTags(tags) {
  if (Array.isArray(tags)) {
    return tags.filter(Boolean)
  }

  if (typeof tags === 'string' && tags.trim()) {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
  }

  return []
}

export function normalizeAlbum(rawAlbum = {}) {
  return {
    ...rawAlbum,
    category: rawAlbum.category || DEFAULT_CATEGORY,
    cover_url: rawAlbum.cover_url || rawAlbum.url || '',
    tags: normalizeTags(rawAlbum.tags),
    related_type: rawAlbum.related_type || 'none',
    related_id: rawAlbum.related_id || null,
    is_featured: Boolean(rawAlbum.is_featured),
    sort_order: Number.isFinite(rawAlbum.sort_order) ? rawAlbum.sort_order : DEFAULT_SORT_ORDER,
    created_at: rawAlbum.created_at || null,
    updated_at: rawAlbum.updated_at || rawAlbum.created_at || null,
  }
}

export function normalizePhoto(rawPhoto = {}) {
  return {
    ...rawPhoto,
    album_id: rawPhoto.album_id || null,
    category: rawPhoto.category || DEFAULT_CATEGORY,
    tags: normalizeTags(rawPhoto.tags),
    related_type: rawPhoto.related_type || 'none',
    related_id: rawPhoto.related_id || null,
    is_featured: Boolean(rawPhoto.is_featured),
    sort_order: Number.isFinite(rawPhoto.sort_order) ? rawPhoto.sort_order : DEFAULT_SORT_ORDER,
    created_at: rawPhoto.created_at || null,
  }
}

function sortAlbums(albums = []) {
  return [...albums].sort((left, right) => {
    if (left.is_featured !== right.is_featured) {
      return left.is_featured ? -1 : 1
    }

    if (left.sort_order !== right.sort_order) {
      return left.sort_order - right.sort_order
    }

    const leftUpdatedAt = new Date(left.updated_at || 0).getTime()
    const rightUpdatedAt = new Date(right.updated_at || 0).getTime()
    if (leftUpdatedAt !== rightUpdatedAt) {
      return rightUpdatedAt - leftUpdatedAt
    }

    const leftCreatedAt = new Date(left.created_at || 0).getTime()
    const rightCreatedAt = new Date(right.created_at || 0).getTime()
    return rightCreatedAt - leftCreatedAt
  })
}

function sortPhotos(photos = []) {
  return [...photos].sort((left, right) => {
    if (left.sort_order !== right.sort_order) {
      return left.sort_order - right.sort_order
    }

    if (left.is_featured !== right.is_featured) {
      return left.is_featured ? -1 : 1
    }

    const leftCreatedAt = new Date(left.created_at || 0).getTime()
    const rightCreatedAt = new Date(right.created_at || 0).getTime()
    return rightCreatedAt - leftCreatedAt
  })
}

function enrichAlbumsWithPhotos(albums = [], photos = []) {
  const groupedPhotos = photos.reduce((accumulator, photo) => {
    const key = photo.album_id || '__none__'
    if (!accumulator[key]) {
      accumulator[key] = []
    }
    accumulator[key].push(photo)
    return accumulator
  }, {})

  return sortAlbums(albums.map((album) => {
    const albumPhotos = sortPhotos(groupedPhotos[album.id] || [])
    return {
      ...album,
      photo_count: albumPhotos.length,
      photos: albumPhotos,
    }
  }))
}

function filterByCategory(items = [], category = 'all') {
  if (!category || category === 'all') {
    return items
  }

  return items.filter((item) => item.category === category)
}

function isValidCategory(category) {
  return galleryCategories.some((item) => item.id === category)
}

async function fetchAllAlbums() {
  if (isMock || !supabase) {
    return mockAlbums.map(normalizeAlbum)
  }

  const data = await apiRequest('/gallery/albums')
  return (data || []).map((album) => ({
    ...normalizeAlbum(album),
    photos: (album.photos || []).map(normalizePhoto),
    photo_count: Number.isFinite(album.photo_count) ? album.photo_count : (album.photos || []).length,
  }))
}

async function fetchAllPhotos() {
  if (isMock || !supabase) {
    return mockPhotos.map(normalizePhoto)
  }

  const albums = await fetchAllAlbums()
  return albums
    .flatMap((album) => album.photos || [])
    .map(normalizePhoto)
}

export function getCategoryMeta(categoryId) {
  return galleryCategories.find((entry) => entry.id === categoryId) || galleryCategories[0]
}

export function buildRelatedLink(typeOrItem, relatedIdValue = null) {
  const type = typeof typeOrItem === 'object'
    ? (typeOrItem?.related_type || 'none')
    : (typeOrItem || 'none')
  const relatedId = typeof typeOrItem === 'object'
    ? typeOrItem?.related_id
    : relatedIdValue

  if (!relatedId || type === 'none') {
    return null
  }

  if (type === 'project') {
    return {
      label: 'View related project',
      href: `/projects?project=${encodeURIComponent(relatedId)}`,
      external: false,
    }
  }

  if (type === 'article') {
    return {
      label: 'View related article',
      href: `/articles/${encodeURIComponent(relatedId)}`,
      external: false,
    }
  }

  if (type === 'agent') {
    return {
      label: 'View related agent',
      href: '/agent-feed',
      external: false,
    }
  }

  if (type === 'external') {
    return {
      label: 'Open external reference',
      href: relatedId,
      external: true,
    }
  }

  return null
}

export async function getGalleryAlbums() {
  if (!(isMock || !supabase)) {
    return fetchAllAlbums()
  }

  const [albums, photos] = await Promise.all([fetchAllAlbums(), fetchAllPhotos()])

  return enrichAlbumsWithPhotos(albums, photos)
}

export async function getAlbumsByCategory(category = 'all') {
  const normalizedCategory = isValidCategory(category) ? category : 'all'
  const albums = await getGalleryAlbums()
  return filterByCategory(albums, normalizedCategory)
}

export async function getGalleryAlbumById(albumId) {
  if (!albumId) {
    return null
  }

  if (!(isMock || !supabase)) {
    const album = await apiRequest(`/gallery/albums/${encodeURIComponent(albumId)}`)
    return album ? {
      ...normalizeAlbum(album),
      photos: (album.photos || []).map(normalizePhoto),
      photo_count: Number.isFinite(album.photo_count) ? album.photo_count : (album.photos || []).length,
    } : null
  }

  const [albums, photos] = await Promise.all([
    fetchAllAlbums(),
    fetchAllPhotos(),
  ])

  const enrichedAlbums = enrichAlbumsWithPhotos(albums, photos)
  return enrichedAlbums.find((album) => album.id === albumId) || null
}

export async function getPhotosByAlbumId(albumId) {
  const photos = await fetchAllPhotos()
  return sortPhotos(photos.filter((photo) => photo.album_id === albumId))
}

export async function getPhotosByCategory(category = 'all') {
  const normalizedCategory = isValidCategory(category) ? category : 'all'
  const photos = await fetchAllPhotos()
  return sortPhotos(filterByCategory(photos, normalizedCategory))
}
