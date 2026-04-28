import { getFriendlyGalleryHubError } from '../../lib/errors.mjs'
import { normalizeGalleryAlbum, normalizeGalleryItem } from '../../lib/normalizers.mjs'
import { createUuid, generateSlug, isUuid } from '../../lib/strings.mjs'

function toTags(input) {
  if (Array.isArray(input)) {
    return input.filter(Boolean)
  }

  if (typeof input === 'string' && input.trim()) {
    return input
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)
  }

  return []
}

export function createGalleryService({ galleryRepo, auditService, agentRegistryService, publishWorkflowService }) {
  return {
    async listPublicAlbums(filters = {}) {
      try {
        const albums = (await galleryRepo.listAlbums({
          status: 'published',
          category: filters.category,
        })).map(normalizeGalleryAlbum)

        const items = (await galleryRepo.listItems({
          status: 'published',
        })).map(normalizeGalleryItem)

        const itemsByAlbum = items.reduce((accumulator, item) => {
          const key = item.album_id || '__none__'
          if (!accumulator[key]) {
            accumulator[key] = []
          }
          accumulator[key].push(item)
          return accumulator
        }, {})

        return albums.map((album) => ({
          ...album,
          photos: itemsByAlbum[album.id] || [],
          photo_count: (itemsByAlbum[album.id] || []).length,
        }))
      } catch (error) {
        throw new Error(getFriendlyGalleryHubError(error))
      }
    },

    async getPublicAlbumById(id) {
      try {
        const album = normalizeGalleryAlbum(await galleryRepo.getAlbumById(id))
        if (album.status && album.status !== 'published') {
          throw new Error('Album not found')
        }

        const items = (await galleryRepo.listItems({
          albumId: id,
          status: 'published',
        })).map(normalizeGalleryItem)
        return {
          ...album,
          photos: items,
          photo_count: items.length,
        }
      } catch (error) {
        throw new Error(getFriendlyGalleryHubError(error))
      }
    },

    async createAgentAlbum(input) {
      try {
        const agent = await agentRegistryService.resolveAgent(input)
        const payload = {
          id: input.id || generateSlug(input.title || 'album', 'album'),
          title: input.title,
          description: input.description || null,
          category: input.category || 'projects',
          cover_url: input.cover_url || input.coverUrl || null,
          tags: toTags(input.tags),
          related_type: input.related_type || 'none',
          related_id: input.related_id || null,
          is_featured: Boolean(input.is_featured),
          sort_order: Number.isFinite(input.sort_order) ? input.sort_order : 999,
          status: input.status || 'draft',
          agent_id: agent.agentId,
          source_type: input.source_type || null,
          source_id: input.source_id || null,
          review_note: null,
          published_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }

        if (!payload.title) {
          throw new Error('title is required')
        }

        const album = normalizeGalleryAlbum(await galleryRepo.createAlbum(payload))
        await auditService.record({
          domain: 'content_hub',
          entityType: 'gallery_album',
          entityId: album.id,
          actorType: 'agent',
          actorId: agent.agentId,
          action: 'draft_created',
          sourceType: album.source_type,
          sourceId: album.source_id,
          payload: album,
        })
        return album
      } catch (error) {
        throw new Error(getFriendlyGalleryHubError(error))
      }
    },

    async addAlbumItems(albumId, input) {
      try {
        const agent = await agentRegistryService.resolveAgent(input)
        const items = Array.isArray(input.items) ? input.items : []
        if (!items.length) {
          throw new Error('items is required')
        }

        const payload = items.map((item, index) => ({
          id: isUuid(item.id) ? item.id : createUuid(),
          album_id: albumId,
          title: item.title,
          description: item.description || null,
          url: item.url,
          tags: toTags(item.tags),
          category: item.category || input.category || 'projects',
          is_featured: Boolean(item.is_featured),
          sort_order: Number.isFinite(item.sort_order) ? item.sort_order : index + 1,
          related_type: item.related_type || 'none',
          related_id: item.related_id || null,
          status: item.status || 'draft',
          agent_id: agent.agentId,
          source_type: item.source_type || input.source_type || null,
          source_id: item.source_id || input.source_id || null,
          published_at: null,
          created_at: new Date().toISOString(),
        }))

        const created = (await galleryRepo.createItems(payload)).map(normalizeGalleryItem)
        await auditService.record({
          domain: 'content_hub',
          entityType: 'gallery_album',
          entityId: albumId,
          actorType: 'agent',
          actorId: agent.agentId,
          action: 'items_appended',
          sourceType: input.source_type || null,
          sourceId: input.source_id || null,
          payload: created,
        })
        return created
      } catch (error) {
        throw new Error(getFriendlyGalleryHubError(error))
      }
    },

    async submitAlbumForReview(id) {
      try {
        const album = normalizeGalleryAlbum(await galleryRepo.updateAlbumById(id, publishWorkflowService.markPendingReview({
          updated_at: new Date().toISOString(),
        })))
        await auditService.record({
          domain: 'content_hub',
          entityType: 'gallery_album',
          entityId: album.id,
          actorType: 'agent',
          actorId: album.agent_id,
          action: 'submitted_for_review',
          sourceType: album.source_type,
          sourceId: album.source_id,
          payload: album,
        })
        return album
      } catch (error) {
        throw new Error(getFriendlyGalleryHubError(error))
      }
    },

    async listPendingAlbums() {
      try {
        return (await galleryRepo.listAlbums({ status: 'pending_review' })).map(normalizeGalleryAlbum)
      } catch (error) {
        throw new Error(getFriendlyGalleryHubError(error))
      }
    },

    async publishAlbum(id) {
      try {
        const album = normalizeGalleryAlbum(await galleryRepo.updateAlbumById(id, publishWorkflowService.markPublished({
          updated_at: new Date().toISOString(),
        })))
        await auditService.record({
          domain: 'content_hub',
          entityType: 'gallery_album',
          entityId: album.id,
          actorType: 'admin',
          actorId: album.agent_id,
          action: 'published',
          sourceType: album.source_type,
          sourceId: album.source_id,
          payload: album,
        })
        return album
      } catch (error) {
        throw new Error(getFriendlyGalleryHubError(error))
      }
    },

    async rejectAlbum(id, reviewNote) {
      try {
        const album = normalizeGalleryAlbum(await galleryRepo.updateAlbumById(id, publishWorkflowService.markRejected(reviewNote, {
          updated_at: new Date().toISOString(),
        })))
        await auditService.record({
          domain: 'content_hub',
          entityType: 'gallery_album',
          entityId: album.id,
          actorType: 'admin',
          actorId: album.agent_id,
          action: 'rejected',
          sourceType: album.source_type,
          sourceId: album.source_id,
          payload: album,
        })
        return album
      } catch (error) {
        throw new Error(getFriendlyGalleryHubError(error))
      }
    },
  }
}
