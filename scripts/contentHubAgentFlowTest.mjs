import {
  assertCondition,
  assertRequired,
  createRunId,
  getTestConfig,
  printStep,
  printSuccess,
  requestJson,
} from './contentHubTestUtils.mjs'

function createAgentHeaders(config) {
  return {
    'X-Agent-Token': config.agentToken,
  }
}

async function main() {
  const config = getTestConfig()
  assertRequired('AGENT_API_TOKEN', config.agentToken)

  const runId = createRunId()
  const sharedIdentity = {
    external_framework: config.externalFramework,
    external_agent_key: config.externalAgentKey,
    agent_name: config.agentName,
    source_type: 'content_hub_smoke',
  }

  printStep(`Running agent flow checks against ${config.baseUrl}`)

  const feedDraft = await requestJson({
    baseUrl: config.baseUrl,
    path: '/api/agent/feed/posts',
    method: 'POST',
    headers: createAgentHeaders(config),
    body: {
      ...sharedIdentity,
      source_id: `${runId}-feed`,
      title: `Content Hub Smoke Feed ${runId}`,
      content: `Smoke test feed draft for ${runId}`,
      summary: 'Automated smoke verification for feed draft flow.',
      post_type: 'project_update',
      tags: ['smoke', 'content-hub'],
      visibility: 'public',
    },
    expectStatus: 201,
    timeoutMs: config.timeoutMs,
  })
  assertCondition(feedDraft?.data?.id, 'Feed draft did not return an id')
  assertCondition(feedDraft?.data?.status === 'draft', 'Feed draft should start in draft status')
  printSuccess('POST /api/agent/feed/posts')

  const submittedFeed = await requestJson({
    baseUrl: config.baseUrl,
    path: `/api/agent/feed/posts/${feedDraft.data.id}/submit-review`,
    method: 'POST',
    headers: createAgentHeaders(config),
    timeoutMs: config.timeoutMs,
  })
  assertCondition(submittedFeed?.data?.status === 'pending_review', 'Feed draft should transition to pending_review')
  printSuccess('POST /api/agent/feed/posts/:postId/submit-review')

  const articleDraft = await requestJson({
    baseUrl: config.baseUrl,
    path: '/api/agent/articles/drafts',
    method: 'POST',
    headers: createAgentHeaders(config),
    body: {
      ...sharedIdentity,
      source_id: `${runId}-article`,
      title: `Content Hub Smoke Article ${runId}`,
      slug: `${runId}-article`,
      content: `<p>Smoke test article draft for ${runId}</p>`,
      excerpt: 'Automated smoke verification for article draft flow.',
      tags: ['smoke', 'content-hub'],
      author_type: 'agent_generated',
    },
    expectStatus: 201,
    timeoutMs: config.timeoutMs,
  })
  assertCondition(articleDraft?.data?.id, 'Article draft did not return an id')
  assertCondition(articleDraft?.data?.status === 'draft', 'Article draft should start in draft status')
  printSuccess('POST /api/agent/articles/drafts')

  const submittedArticle = await requestJson({
    baseUrl: config.baseUrl,
    path: `/api/agent/articles/drafts/${articleDraft.data.id}/submit-review`,
    method: 'POST',
    headers: createAgentHeaders(config),
    body: {
      review_note: 'Automated smoke test submission.',
    },
    timeoutMs: config.timeoutMs,
  })
  assertCondition(submittedArticle?.data?.status === 'pending_review', 'Article draft should transition to pending_review')
  printSuccess('POST /api/agent/articles/drafts/:articleId/submit-review')

  const albumDraft = await requestJson({
    baseUrl: config.baseUrl,
    path: '/api/agent/gallery/albums',
    method: 'POST',
    headers: createAgentHeaders(config),
    body: {
      ...sharedIdentity,
      source_id: `${runId}-album`,
      title: `Content Hub Smoke Album ${runId}`,
      description: 'Automated smoke verification for gallery album flow.',
      category: 'agents',
      cover_url: `https://example.com/${runId}.jpg`,
      tags: ['smoke', 'content-hub'],
      related_type: 'agent',
      related_id: config.externalAgentKey,
    },
    expectStatus: 201,
    timeoutMs: config.timeoutMs,
  })
  assertCondition(albumDraft?.data?.id, 'Gallery album draft did not return an id')
  assertCondition(albumDraft?.data?.status === 'draft', 'Gallery album should start in draft status')
  printSuccess('POST /api/agent/gallery/albums')

  const albumItems = await requestJson({
    baseUrl: config.baseUrl,
    path: `/api/agent/gallery/albums/${albumDraft.data.id}/items`,
    method: 'POST',
    headers: createAgentHeaders(config),
    body: {
      ...sharedIdentity,
      source_id: `${runId}-album-items`,
      items: [
        {
          title: `Content Hub Smoke Item ${runId}`,
          url: `https://example.com/${runId}-item.jpg`,
          description: 'Automated smoke verification for gallery item flow.',
          tags: ['smoke'],
          category: 'agents',
          related_type: 'agent',
          related_id: config.externalAgentKey,
        },
      ],
    },
    expectStatus: 201,
    timeoutMs: config.timeoutMs,
  })
  assertCondition(Array.isArray(albumItems?.data) && albumItems.data.length === 1, 'Gallery item append should create one item')
  printSuccess('POST /api/agent/gallery/albums/:albumId/items')

  const submittedAlbum = await requestJson({
    baseUrl: config.baseUrl,
    path: `/api/agent/gallery/albums/${albumDraft.data.id}/submit-review`,
    method: 'POST',
    headers: createAgentHeaders(config),
    timeoutMs: config.timeoutMs,
  })
  assertCondition(submittedAlbum?.data?.status === 'pending_review', 'Gallery album should transition to pending_review')
  printSuccess('POST /api/agent/gallery/albums/:albumId/submit-review')

  printStep(`Agent flow checks completed successfully for ${runId}`)
}

main().catch((error) => {
  console.error(`[content-hub] FAILED ${error.message}`)
  process.exitCode = 1
})
