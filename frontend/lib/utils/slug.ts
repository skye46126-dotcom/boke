/**
 * 将标题转换为 URL 友好的 slug
 * 支持中文和英文
 */
export function generateSlug(title: string): string {
  // 移除特殊字符，保留字母、数字、中文、连字符和空格
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u4e00-\u9fa5-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // 如果是纯中文标题，使用拼音或保持原样
  // 这里简单处理，实际项目中可以使用 pinyin 库
  if (/^[\u4e00-\u9fa5-]+$/.test(slug)) {
    // 对于纯中文，可以考虑使用时间戳或 ID
    return slug;
  }

  return slug;
}

/**
 * 生成唯一的 slug
 * 如果 slug 已存在，添加数字后缀
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug;
  let counter = 1;

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}