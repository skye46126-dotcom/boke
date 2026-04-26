import { apiRequest } from '@/lib/api'
import {
  applySiteContent,
  defaultSiteContent,
  getSiteContentSnapshot,
} from '@/data/portfolio'

export async function loadPublicSiteContent() {
  try {
    const data = await apiRequest('/site-content')
    applySiteContent(data)
    return data
  } catch (error) {
    console.warn('Falling back to default homepage content:', error)
    applySiteContent(defaultSiteContent)
    return getSiteContentSnapshot()
  }
}

export async function loadAdminSiteContent() {
  return apiRequest('/admin/site-content', {}, { admin: true })
}

export async function updateAdminSiteContent(payload) {
  const data = await apiRequest('/admin/site-content', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }, { admin: true })

  applySiteContent(data)
  return data
}
