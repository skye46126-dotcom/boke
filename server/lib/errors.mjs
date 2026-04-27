function hasMissingRelation(error, relationName) {
  const message = error?.message || ''
  return (
    message.includes(`Could not find the table 'public.${relationName}'`) ||
    message.includes(`relation "public.${relationName}" does not exist`) ||
    error?.code === 'PGRST205' ||
    error?.code === '42P01'
  )
}

export function getFriendlySiteContentError(error) {
  if (hasMissingRelation(error, 'site_content')) {
    return 'The site_content table is missing in Supabase. Run scripts/phase1_cloud_supabase_setup.sql first.'
  }

  return error?.message || 'Site content request failed'
}

export function getFriendlyGalleryHubError(error) {
  const message = error?.message || ''
  if (
    message.includes('column "status" of relation "gallery_albums" does not exist') ||
    message.includes('column "agent_id" of relation "gallery_albums" does not exist') ||
    message.includes('column "status" of relation "gallery" does not exist') ||
    message.includes('column "source_type" of relation "gallery_albums" does not exist')
  ) {
    return 'The gallery aggregation schema is not ready. Run scripts/phase2_content_hub_aggregation.sql first.'
  }

  return error?.message || 'Gallery request failed'
}
