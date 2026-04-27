export function createEventService({ eventRepo }) {
  return {
    async listRecent(limit = 100) {
      return eventRepo.listRecent({ limit })
    },
  }
}
