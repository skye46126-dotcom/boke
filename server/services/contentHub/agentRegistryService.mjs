function normalizedString(value) {
  const text = String(value || '').trim()
  return text || null
}

function stripVcpMaidPrefix(value) {
  const text = normalizedString(value)
  if (!text) return null
  const match = text.match(/^\[[^\]]+\](.+)$/)
  return normalizedString(match ? match[1] : text)
}

function slugifyAgentKey(value) {
  const text = stripVcpMaidPrefix(value)
  if (!text) return null

  const slug = text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5\s_-]/g, ' ')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()

  return normalizedString(slug)
}

function inferFramework(input = {}) {
  return (
    normalizedString(input.external_framework) ||
    normalizedString(input.externalFramework) ||
    normalizedString(input.framework) ||
    normalizedString(input.source_framework) ||
    null
  )
}

function inferExternalKey(input = {}) {
  return (
    normalizedString(input.external_agent_key) ||
    normalizedString(input.externalAgentKey) ||
    normalizedString(input.agent_key) ||
    normalizedString(input.agentKey) ||
    slugifyAgentKey(input.maid) ||
    slugifyAgentKey(input.maidName) ||
    slugifyAgentKey(input.maid_name) ||
    slugifyAgentKey(input.agent_name) ||
    slugifyAgentKey(input.agentName) ||
    null
  )
}

function inferDisplayName(input = {}) {
  return (
    stripVcpMaidPrefix(input.agent_name) ||
    stripVcpMaidPrefix(input.agentName) ||
    stripVcpMaidPrefix(input.display_name) ||
    stripVcpMaidPrefix(input.displayName) ||
    stripVcpMaidPrefix(input.maid) ||
    stripVcpMaidPrefix(input.maidName) ||
    stripVcpMaidPrefix(input.maid_name) ||
    stripVcpMaidPrefix(input.author_name) ||
    stripVcpMaidPrefix(input.authorName) ||
    inferExternalKey(input) ||
    'Agent'
  )
}

export function createAgentRegistryService({ profileRepo }) {
  return {
    async resolveAgent(input = {}) {
      const directAgentId = normalizedString(input.agent_id || input.agentId)
      if (directAgentId) {
        const profile = await profileRepo.getById(directAgentId)
        return {
          agentId: profile.id,
          profile,
          resolution: 'direct_id',
        }
      }

      const framework = inferFramework(input)
      const externalKey = inferExternalKey(input)

      if (!framework || !externalKey) {
        return {
          agentId: null,
          profile: null,
          resolution: 'anonymous',
        }
      }

      const existing = await profileRepo.findByExternalIdentity({
        framework,
        key: externalKey,
      })

      if (existing) {
        const displayName = inferDisplayName(input)
        const avatarUrl = normalizedString(input.avatar_url || input.avatarUrl)
        const updates = {}

        if (displayName && displayName !== 'Agent' && existing.name !== displayName) {
          updates.name = displayName
        }
        if (avatarUrl && existing.avatar_url !== avatarUrl) {
          updates.avatar_url = avatarUrl
        }

        const profile = Object.keys(updates).length
          ? await profileRepo.updateById(existing.id, updates)
          : existing

        return {
          agentId: profile.id,
          profile,
          resolution: 'external_existing',
        }
      }

      const created = await profileRepo.create({
        name: inferDisplayName(input),
        avatar_url: normalizedString(input.avatar_url || input.avatarUrl),
        description: normalizedString(input.description) || `Imported from ${framework}`,
        role: normalizedString(input.role) || 'agent',
        is_active: true,
        external_framework: framework,
        external_agent_key: externalKey,
        capabilities: input.capabilities || {},
      })

      return {
        agentId: created.id,
        profile: created,
        resolution: 'external_created',
      }
    },
  }
}
