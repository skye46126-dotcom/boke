export function createConfig(env) {
  const allowDevAdminPassword = (
    env.BOKE_ALLOW_DEV_ADMIN_PASSWORD === 'true' ||
    (env.NODE_ENV && env.NODE_ENV !== 'production')
  )

  return {
    env,
    port: Number(env.API_PORT || env.PORT || 8787),
    supabaseUrl: env.SUPABASE_URL || env.VITE_SUPABASE_URL,
    supabaseAnonKey: env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY,
    adminPassword: (
      env.ADMIN_PASSWORD ||
      env.ADMIN_DEV_PASSWORD ||
      env.VITE_ADMIN_PASSWORD ||
      (allowDevAdminPassword ? 'admin' : '')
    ).trim(),
    agentApiToken: (env.AGENT_API_TOKEN || '').trim(),
  }
}

export function validateConfig(config) {
  if (!config.supabaseUrl || !config.supabaseAnonKey || !config.supabaseServiceRoleKey) {
    throw new Error('Missing Supabase server configuration. Required: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY')
  }
}
