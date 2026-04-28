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
    inferExplicitDisplayName(input) ||
    inferExternalKey(input) ||
    'Agent'
  )
}

function inferExplicitDisplayName(input = {}) {
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
    null
  )
}

function normalizeObject(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  return value
}

function mergeObjects(base, next) {
  return {
    ...(normalizeObject(base) || {}),
    ...(normalizeObject(next) || {}),
  }
}

function createDefaultPolicy({ framework = null, externalKey = null, profile = null } = {}) {
  const registrationStatus = normalizedString(profile?.registration_status) || 'active'
  const isActive = profile?.is_active !== false && registrationStatus === 'active'

  return {
    external_framework: framework || profile?.external_framework || null,
    external_agent_key: externalKey || profile?.external_agent_key || null,
    can_post: isActive,
    can_reply: isActive,
    auto_publish_posts: false,
    auto_publish_replies: true,
    require_review: true,
  }
}

function buildProfileCreatePayload(input = {}, framework, externalKey) {
  const metadata = normalizeObject(input.metadata) || {}

  return {
    name: inferDisplayName(input),
    avatar_url: normalizedString(input.avatar_url || input.avatarUrl),
    description: normalizedString(input.description) || `Imported from ${framework}`,
    role: normalizedString(input.role) || 'agent',
    is_active: input.is_active === false ? false : true,
    external_framework: framework,
    external_agent_key: externalKey,
    registration_status: normalizedString(input.registration_status) || 'active',
    last_seen_at: new Date().toISOString(),
    metadata,
    capabilities: normalizeObject(input.capabilities) || {},
  }
}

function buildProfileUpdatePayload(existing, input = {}) {
  const displayName = inferExplicitDisplayName(input)
  const avatarUrl = normalizedString(input.avatar_url || input.avatarUrl)
  const description = normalizedString(input.description)
  const role = normalizedString(input.role)
  const registrationStatus = normalizedString(input.registration_status)
  const metadata = normalizeObject(input.metadata)
  const capabilities = normalizeObject(input.capabilities)
  const updates = {
    last_seen_at: new Date().toISOString(),
  }

  if (displayName && displayName !== 'Agent' && existing.name !== displayName) {
    updates.name = displayName
  }
  if (avatarUrl && existing.avatar_url !== avatarUrl) {
    updates.avatar_url = avatarUrl
  }
  if (description && existing.description !== description) {
    updates.description = description
  }
  if (role && existing.role !== role) {
    updates.role = role
  }
  if (registrationStatus && existing.registration_status !== registrationStatus) {
    updates.registration_status = registrationStatus
  }
  if (metadata) {
    updates.metadata = mergeObjects(existing.metadata, metadata)
  }
  if (capabilities) {
    updates.capabilities = mergeObjects(existing.capabilities, capabilities)
  }

  return updates
}

async function ensurePolicy(agentPolicyRepo, profile, input = {}) {
  const framework = normalizedString(profile?.external_framework) || inferFramework(input)
  const externalKey = normalizedString(profile?.external_agent_key) || inferExternalKey(input)
  const fallbackPolicy = createDefaultPolicy({ framework, externalKey, profile })

  if (!framework || !externalKey) {
    return fallbackPolicy
  }

  const existing = await agentPolicyRepo.findByExternalIdentity({
    framework,
    key: externalKey,
  })

  if (existing) {
    return {
      ...fallbackPolicy,
      ...existing,
      can_post: fallbackPolicy.can_post && (existing.can_post ?? true),
      can_reply: fallbackPolicy.can_reply && (existing.can_reply ?? true),
      auto_publish_posts: existing.auto_publish_posts ?? fallbackPolicy.auto_publish_posts,
      auto_publish_replies: existing.auto_publish_replies ?? fallbackPolicy.auto_publish_replies,
      require_review: existing.require_review ?? fallbackPolicy.require_review,
    }
  }

  return agentPolicyRepo.upsertByExternalIdentity({
    ...fallbackPolicy,
  })
}

export function createAgentRegistryService({ profileRepo, agentPolicyRepo }) {
  return {
    async getAgentProfile(input = {}) {
      const directAgentId = normalizedString(input.agent_id || input.agentId)
      if (directAgentId) {
        const profile = await profileRepo.getById(directAgentId)
        return {
          agentId: profile.id,
          profile,
          policy: await ensurePolicy(agentPolicyRepo, profile, input),
          resolution: 'direct_id',
        }
      }

      const framework = inferFramework(input)
      const externalKey = inferExternalKey(input)
      if (!framework || !externalKey) {
        throw new Error('external_framework and external_agent_key are required')
      }

      const profile = await profileRepo.findByExternalIdentity({
        framework,
        key: externalKey,
      })

      if (!profile) {
        throw new Error('Agent profile not found')
      }

      return {
        agentId: profile.id,
        profile,
        policy: await ensurePolicy(agentPolicyRepo, profile, input),
        resolution: 'external_existing',
      }
    },

    async registerAgent(input = {}) {
      const framework = inferFramework(input)
      const externalKey = inferExternalKey(input)

      if (!framework || !externalKey) {
        throw new Error('external_framework and external_agent_key are required')
      }

      const existing = await profileRepo.findByExternalIdentity({
        framework,
        key: externalKey,
      })

      const profile = existing
        ? await profileRepo.updateById(existing.id, buildProfileUpdatePayload(existing, input))
        : await profileRepo.create(buildProfileCreatePayload(input, framework, externalKey))

      return {
        agentId: profile.id,
        profile,
        policy: await ensurePolicy(agentPolicyRepo, profile, input),
        resolution: existing ? 'external_existing' : 'external_created',
      }
    },

    async touchAgent(profileId, updates = {}) {
      if (!profileId) {
        return null
      }

      return profileRepo.touchById(profileId, updates)
    },

    async getAgentPolicy(profile, input = {}) {
      return ensurePolicy(agentPolicyRepo, profile, input)
    },

    async resolveAgent(input = {}) {
      const directAgentId = normalizedString(input.agent_id || input.agentId)
      if (directAgentId) {
        const profile = await this.touchAgent(directAgentId)
        return {
          agentId: profile.id,
          profile,
          policy: await ensurePolicy(agentPolicyRepo, profile, input),
          resolution: 'direct_id',
        }
      }

      const framework = inferFramework(input)
      const externalKey = inferExternalKey(input)

      if (!framework || !externalKey) {
        return {
          agentId: null,
          profile: null,
          policy: createDefaultPolicy(),
          resolution: 'anonymous',
        }
      }

      const existing = await profileRepo.findByExternalIdentity({
        framework,
        key: externalKey,
      })

      if (existing) {
        const profile = await profileRepo.updateById(existing.id, buildProfileUpdatePayload(existing, input))
        return {
          agentId: profile.id,
          profile,
          policy: await ensurePolicy(agentPolicyRepo, profile, input),
          resolution: 'external_existing',
        }
      }

      const profile = await profileRepo.create(buildProfileCreatePayload(input, framework, externalKey))

      return {
        agentId: profile.id,
        profile,
        policy: await ensurePolicy(agentPolicyRepo, profile, input),
        resolution: 'external_created',
      }
    },
  }
}
