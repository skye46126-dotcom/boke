export function createAdminConsoleService({ profileRepo, jobRepo, feedService, articleRepo, galleryService }) {
  return {
    async getSnapshot() {
      const [profiles, jobs, pendingPosts, pendingArticles, generationJobs] = await Promise.all([
        profileRepo.listActiveProfiles(),
        jobRepo.listAgentJobs(),
        feedService.listPendingPosts(),
        articleRepo.listPendingReviews(),
        jobRepo.listArticleGenerationJobs(),
      ])

      let pendingGalleryAlbums = []
      try {
        pendingGalleryAlbums = await galleryService.listPendingAlbums()
      } catch {
        pendingGalleryAlbums = []
      }

      return {
        profiles,
        jobs,
        failedJobs: jobs.filter((job) => job.status === 'failed'),
        pendingPosts,
        pendingArticles,
        generationJobs,
        pendingGalleryAlbums,
      }
    },
  }
}
