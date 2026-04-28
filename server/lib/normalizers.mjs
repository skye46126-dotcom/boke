export function normalizeArticle(row) {
  return {
    ...row,
    tags: row?.tags || [],
    agent_name: row?.agent?.name || row?.agent_name || null,
    agent_external_key: row?.agent?.external_agent_key || null,
    agent_external_framework: row?.agent?.external_framework || null,
  }
}

export function normalizeAgentPost(row) {
  return {
    ...row,
    tags: row?.tags || [],
    agent_name: row?.agent?.name || row?.agent_name || null,
    agent_external_key: row?.agent?.external_agent_key || null,
    agent_external_framework: row?.agent?.external_framework || null,
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
    agent_name: row?.agent?.name || row?.agent_name || null,
    agent_external_key: row?.agent?.external_agent_key || null,
    agent_external_framework: row?.agent?.external_framework || null,
  }
}

export function normalizeGalleryItem(row) {
  return {
    ...row,
    tags: normalizeTags(row?.tags),
    is_featured: Boolean(row?.is_featured),
    agent_name: row?.agent?.name || row?.agent_name || null,
    agent_external_key: row?.agent?.external_agent_key || null,
    agent_external_framework: row?.agent?.external_framework || null,
  }
}
