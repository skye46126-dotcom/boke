/**
 * 生成 Markdown 图片语法
 */
export function generateMarkdownImage(url: string, alt: string = 'image'): string {
  return `![${alt}](${url})`;
}

/**
 * 生成 Markdown 链接语法
 */
export function generateMarkdownLink(url: string, text: string): string {
  return `[${text}](${url})`;
}

/**
 * 从文件名提取 alt 文本
 */
export function extractAltFromFilename(filename: string): string {
  // 移除扩展名
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  
  // 如果移除扩展名后为空，返回默认值
  if (!nameWithoutExt || nameWithoutExt.trim().length === 0) {
    return 'image';
  }
  
  // 替换特殊字符为空格
  let alt = nameWithoutExt
    .replace(/[-_]/g, ' ')
    .replace(/[^\w\s\u4e00-\u9fa5]/g, '') // 移除特殊字符
    .replace(/\s+/g, ' ')
    .trim();
  
  // 如果清理后为空，返回默认值
  return alt.length > 0 ? alt : 'image';
}

/**
 * 验证 URL 是否有效且安全
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // 只允许 http 和 https 协议
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
