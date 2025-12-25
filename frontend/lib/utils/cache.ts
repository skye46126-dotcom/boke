/**
 * 缓存策略配置
 */

export const CACHE_STRATEGIES = {
  // 静态内容 - 长期缓存
  STATIC: {
    'Cache-Control': 'public, max-age=31536000, immutable',
  },
  
  // 文章列表 - 短期缓存
  ARTICLE_LIST: {
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
  },
  
  // 文章详情 - 中期缓存
  ARTICLE_DETAIL: {
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  },
  
  // 管理接口 - 不缓存
  ADMIN: {
    'Cache-Control': 'private, no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
  
  // 动态内容 - 不缓存
  NO_CACHE: {
    'Cache-Control': 'no-store, must-revalidate',
  },
};

/**
 * 获取缓存头配置
 */
export function getCacheHeaders(
  strategy: keyof typeof CACHE_STRATEGIES
): Record<string, string> {
  return CACHE_STRATEGIES[strategy];
}
