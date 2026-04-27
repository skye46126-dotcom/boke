export function createPublishWorkflowService() {
  return {
    markPendingReview(extra = {}) {
      return {
        status: 'pending_review',
        ...extra,
      }
    },

    markPublished(extra = {}) {
      return {
        status: 'published',
        published_at: new Date().toISOString(),
        review_note: null,
        ...extra,
      }
    },

    markRejected(reviewNote, extra = {}) {
      return {
        status: 'rejected',
        review_note: reviewNote || '需要进一步人工整理后再发布。',
        ...extra,
      }
    },
  }
}
