export function normalizeArticle(row) {
  return {
    ...row,
    tags: row?.tags || [],
  }
}

export function normalizeAgentPost(row) {
  return {
    ...row,
    tags: row?.tags || [],
  }
}

export function normalizeSiteContent(row) {
  return {
    personalInfo: row?.personal_info || {},
    socialLinks: row?.social_links || [],
    navItems: row?.nav_items || [],
    skills: row?.skills || [],
    experiences: row?.experiences || [],
    projects: row?.projects || [],
  }
}

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

export function normalizeGalleryAlbum(row) {
  return {
    ...row,
    tags: normalizeTags(row?.tags),
    is_featured: Boolean(row?.is_featured),
  }
}

export function normalizeGalleryItem(row) {
  return {
    ...row,
    tags: normalizeTags(row?.tags),
    is_featured: Boolean(row?.is_featured),
  }
}
