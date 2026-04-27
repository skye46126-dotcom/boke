export function createAuditService({ eventRepo }) {
  return {
    async record(event) {
      if (!eventRepo) {
        return null
      }

      try {
        return await eventRepo.create({
          domain: event.domain,
          entity_type: event.entityType,
          entity_id: event.entityId,
          actor_type: event.actorType,
          actor_id: event.actorId || null,
          action: event.action,
          status: event.status || 'completed',
          source_type: event.sourceType || null,
          source_id: event.sourceId || null,
          payload: event.payload || {},
        })
      } catch {
        return null
      }
    },
  }
}
