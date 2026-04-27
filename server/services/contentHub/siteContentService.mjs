import { getFriendlySiteContentError } from '../../lib/errors.mjs'
import { normalizeSiteContent } from '../../lib/normalizers.mjs'

export function createSiteContentService({ siteContentRepo }) {
  return {
    async getPublic() {
      try {
        return normalizeSiteContent(await siteContentRepo.getSingleton())
      } catch (error) {
        throw new Error(getFriendlySiteContentError(error))
      }
    },

    async update(input) {
      try {
        return normalizeSiteContent(await siteContentRepo.upsertSingleton({
          personal_info: input.personalInfo || {},
          social_links: input.socialLinks || [],
          nav_items: input.navItems || [],
          skills: input.skills || [],
          experiences: input.experiences || [],
          projects: input.projects || [],
          updated_at: new Date().toISOString(),
        }))
      } catch (error) {
        throw new Error(getFriendlySiteContentError(error))
      }
    },
  }
}
