function normalizedString(value) {
  const text = String(value || '').trim()
  return text || null
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
    null
  )
}

function inferDisplayName(input = {}) {
  return (
    normalizedString(input.agent_name) ||
    normalizedString(input.agentName) ||
    normalizedString(input.display_name) ||
    normalizedString(input.displayName) ||
    normalizedString(input.maid) ||
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
        return {
          agentId: existing.id,
          profile: existing,
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
