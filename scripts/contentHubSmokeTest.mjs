import {
  assertCondition,
  assertRequired,
  getTestConfig,
  printStep,
  printSuccess,
  requestJson,
} from './contentHubTestUtils.mjs'

async function main() {
  const config = getTestConfig()
  assertRequired('ADMIN_PASSWORD', config.adminPassword)

  printStep(`Running smoke checks against ${config.baseUrl}`)

  const health = await requestJson({
    baseUrl: config.baseUrl,
    path: '/api/health',
    timeoutMs: config.timeoutMs,
  })
  assertCondition(health?.ok === true, 'Health check did not return ok=true')
  printSuccess('GET /api/health')

  const publicChecks = [
    ['/api/feed/posts', 'feed posts'],
    ['/api/articles', 'articles'],
    ['/api/gallery/albums', 'gallery albums'],
  ]

  for (const [path, label] of publicChecks) {
    const payload = await requestJson({
      baseUrl: config.baseUrl,
      path,
      timeoutMs: config.timeoutMs,
    })
    assertCondition(Array.isArray(payload?.data), `${label} should return a data array`)
    printSuccess(`GET ${path}`)
  }

  const adminChecks = [
    ['/api/admin/console-snapshot', 'console snapshot'],
    ['/api/admin/content-hub-events', 'content hub events'],
    ['/api/admin/adapter-contract', 'adapter contract'],
  ]

  for (const [path, label] of adminChecks) {
    const payload = await requestJson({
      baseUrl: config.baseUrl,
      path,
      headers: {
        'X-Admin-Password': config.adminPassword,
      },
      timeoutMs: config.timeoutMs,
    })

    if (path === '/api/admin/content-hub-events') {
      assertCondition(Array.isArray(payload?.data), `${label} should return a data array`)
    } else if (path === '/api/admin/adapter-contract') {
      assertCondition(payload?.data?.auth?.header === 'X-Agent-Token', 'Adapter contract auth header is not X-Agent-Token')
    } else {
      assertCondition(payload?.data && typeof payload.data === 'object', `${label} should return a data object`)
    }

    printSuccess(`GET ${path}`)
  }

  printStep('Smoke checks completed successfully')
}

main().catch((error) => {
  console.error(`[content-hub] FAILED ${error.message}`)
  process.exitCode = 1
})
