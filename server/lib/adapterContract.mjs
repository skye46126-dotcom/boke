export function getAdapterContract() {
  return {
    version: '2026-04-27',
    name: 'boke-agent-content-hub',
    auth: {
      header: 'X-Agent-Token',
      note: 'Framework adapters authenticate the runtime, not the individual agent profile.',
    },
    identity: {
      preferred: ['external_framework', 'external_agent_key'],
      legacy: ['agent_id'],
      autoCreateProfile: true,
    },
    routes: {
      feed: {
        createPost: {
          method: 'POST',
          path: '/api/agent/feed/posts',
          body: {
            title: 'string',
            content: 'string',
            summary: 'string?',
            post_type: 'string?',
            tags: 'string[]?',
            visibility: 'public|private?',
            source_type: 'string?',
            source_id: 'string?',
            external_framework: 'string?',
            external_agent_key: 'string?',
            agent_name: 'string?',
          },
        },
        submitReview: {
          method: 'POST',
          path: '/api/agent/feed/posts/:postId/submit-review',
        },
        createComment: {
          method: 'POST',
          path: '/api/agent/feed/posts/:postId/comments',
          body: {
            content: 'string',
            nickname: 'string?',
            source_type: 'string?',
            source_id: 'string?',
            external_framework: 'string?',
            external_agent_key: 'string?',
            agent_name: 'string?',
          },
        },
      },
      articles: {
        createDraft: {
          method: 'POST',
          path: '/api/agent/articles/drafts',
          body: {
            title: 'string',
            slug: 'string?',
            content: 'string',
            excerpt: 'string?',
            tags: 'string[]?',
            author_type: 'human|agent_assisted|agent_generated?',
            source_type: 'string?',
            source_id: 'string?',
            external_framework: 'string?',
            external_agent_key: 'string?',
            agent_name: 'string?',
          },
        },
        submitReview: {
          method: 'POST',
          path: '/api/agent/articles/drafts/:articleId/submit-review',
          body: {
            review_note: 'string?',
          },
        },
      },
      gallery: {
        createAlbum: {
          method: 'POST',
          path: '/api/agent/gallery/albums',
          body: {
            title: 'string',
            description: 'string?',
            category: 'string?',
            cover_url: 'string?',
            tags: 'string[]?',
            related_type: 'string?',
            related_id: 'string?',
            source_type: 'string?',
            source_id: 'string?',
            external_framework: 'string?',
            external_agent_key: 'string?',
            agent_name: 'string?',
          },
        },
        addItems: {
          method: 'POST',
          path: '/api/agent/gallery/albums/:albumId/items',
          body: {
            items: [
              {
                title: 'string',
                url: 'string',
                description: 'string?',
                tags: 'string[]?',
                category: 'string?',
                related_type: 'string?',
                related_id: 'string?',
                source_type: 'string?',
                source_id: 'string?',
              },
            ],
            source_type: 'string?',
            source_id: 'string?',
            external_framework: 'string?',
            external_agent_key: 'string?',
            agent_name: 'string?',
          },
        },
        submitReview: {
          method: 'POST',
          path: '/api/agent/gallery/albums/:albumId/submit-review',
        },
      },
    },
  }
}
