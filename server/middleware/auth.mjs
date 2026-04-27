export function createAuthMiddleware(config) {
  return {
    async requireAdmin(req) {
      const password = (req.headers['x-admin-password'] || '').trim()

      if (!config.adminPassword) {
        throw new Error('ADMIN_PASSWORD is not configured')
      }

      if (!password || password !== config.adminPassword) {
        throw new Error('Invalid admin password')
      }

      return { method: 'password' }
    },

    requireAgent(req) {
      if (!config.agentApiToken) {
        throw new Error('AGENT_API_TOKEN is not configured')
      }

      const token = (req.headers['x-agent-token'] || '').trim()
      if (!token || token !== config.agentApiToken) {
        throw new Error('Invalid agent token')
      }

      return { method: 'token' }
    },
  }
}
