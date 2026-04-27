export function createGalleryRepository(adminDb) {
  return {
    async listAlbums(filters = {}) {
      let query = adminDb
        .from('gallery_albums')
        .select('*')
        .order('updated_at', { ascending: false })

      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data || []
    },

    async listItems(filters = {}) {
      let query = adminDb
        .from('gallery')
        .select('*')
        .order('sort_order', { ascending: true })

      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      if (filters.albumId) {
        query = query.eq('album_id', filters.albumId)
      }

      if (filters.category && filters.category !== 'all') {
        query = query.eq('category', filters.category)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data || []
    },

    async getAlbumById(id) {
      const { data, error } = await adminDb
        .from('gallery_albums')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        throw error
      }

      return data
    },

    async createAlbum(payload) {
      const { data, error } = await adminDb
        .from('gallery_albums')
        .insert(payload)
        .select('*')
        .single()

      if (error) {
        throw error
      }

      return data
    },

    async updateAlbumById(id, payload) {
      const { data, error } = await adminDb
        .from('gallery_albums')
        .update(payload)
        .eq('id', id)
        .select('*')
        .single()

      if (error) {
        throw error
      }

      return data
    },

    async createItems(payload) {
      const { data, error } = await adminDb
        .from('gallery')
        .insert(payload)
        .select('*')

      if (error) {
        throw error
      }

      return data || []
    },
  }
}
