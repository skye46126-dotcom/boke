import { createConfig, validateConfig } from './lib/config.mjs'
import { createAdminDb } from './lib/supabaseAdmin.mjs'
import { createAuthMiddleware } from './middleware/auth.mjs'
import { createAgentPolicyRepository } from './repositories/agentPolicyRepo.mjs'
import { createArticleRepository } from './repositories/articleRepo.mjs'
import { createFeedRepository } from './repositories/feedRepo.mjs'
import { createGalleryRepository } from './repositories/galleryRepo.mjs'
import { createJobRepository } from './repositories/jobRepo.mjs'
import { createProfileRepository } from './repositories/profileRepo.mjs'
import { createSiteContentRepository } from './repositories/siteContentRepo.mjs'
import { createEventRepository } from './repositories/eventRepo.mjs'
import { createAuditService } from './services/contentHub/auditService.mjs'
import { createEventService } from './services/contentHub/eventService.mjs'
import { createPublishWorkflowService } from './services/contentHub/publishWorkflowService.mjs'
import { createArticleService } from './services/contentHub/articleService.mjs'
import { createAgentRegistryService } from './services/contentHub/agentRegistryService.mjs'
import { createFeedService } from './services/contentHub/feedService.mjs'
import { createGalleryService } from './services/contentHub/galleryService.mjs'
import { createSiteContentService } from './services/contentHub/siteContentService.mjs'
import { createAdminConsoleService } from './services/contentHub/adminConsoleService.mjs'

export function createAppContextFromEnv(envInput = {}) {
  const env = { ...envInput }
  const config = createConfig(env)
  validateConfig(config)

  const adminDb = createAdminDb(config)
  const auth = createAuthMiddleware(config)

  const repositories = {
    agentPolicyRepo: createAgentPolicyRepository(adminDb),
    articleRepo: createArticleRepository(adminDb),
    feedRepo: createFeedRepository(adminDb),
    galleryRepo: createGalleryRepository(adminDb),
    jobRepo: createJobRepository(adminDb),
    profileRepo: createProfileRepository(adminDb),
    siteContentRepo: createSiteContentRepository(adminDb),
    eventRepo: createEventRepository(adminDb),
  }

  const publishWorkflowService = createPublishWorkflowService()
  const auditService = createAuditService({
    eventRepo: repositories.eventRepo,
  })
  const agentRegistryService = createAgentRegistryService({
    agentPolicyRepo: repositories.agentPolicyRepo,
    profileRepo: repositories.profileRepo,
  })

  const feedService = createFeedService({
    feedRepo: repositories.feedRepo,
    auditService,
    agentRegistryService,
    publishWorkflowService,
  })
  const galleryService = createGalleryService({
    galleryRepo: repositories.galleryRepo,
    auditService,
    agentRegistryService,
    publishWorkflowService,
  })

  const services = {
    agentRegistryService,
    auditService,
    eventService: createEventService({
      eventRepo: repositories.eventRepo,
    }),
    publishWorkflowService,
    articleService: createArticleService({
      articleRepo: repositories.articleRepo,
      jobRepo: repositories.jobRepo,
      auditService,
      agentRegistryService,
      publishWorkflowService,
    }),
    feedService,
    galleryService,
    siteContentService: createSiteContentService({
      siteContentRepo: repositories.siteContentRepo,
    }),
    adminConsoleService: createAdminConsoleService({
      profileRepo: repositories.profileRepo,
      jobRepo: repositories.jobRepo,
      feedService,
      articleRepo: repositories.articleRepo,
      galleryService,
    }),
  }

  return {
    env,
    config,
    adminDb,
    auth,
    repositories,
    services,
  }
}

export const createAppContext = createAppContextFromEnv
