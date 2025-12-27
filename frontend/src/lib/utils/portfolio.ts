/**
 * Portfolio Utility Functions
 * 数据转换和处理工具
 */

import { Article, CardData, CardCategory } from '@/types/portfolio';

/**
 * 从文章内容中提取链接
 * 约定：第一行 [link](URL) 格式
 */
export function extractLink(content: string): string | null {
  const linkMatch = content.match(/^\[link\]\((.+?)\)/);
  return linkMatch ? linkMatch[1] : null;
}

/**
 * 移除内容中的链接行
 */
export function removeLink(content: string): string {
  return content.replace(/^\[link\]\(.+?\)\n?/, '').trim();
}

/**
 * 从标签中确定卡片类别
 */
export function getCategoryFromTags(tags?: Array<{ slug: string }>): CardCategory {
  if (!tags || tags.length === 0) return 'default';

  const categoryTag = tags.find(t => t.slug.startsWith('category-'));
  if (!categoryTag) return 'default';

  const category = categoryTag.slug.replace('category-', '');
  
  // 映射到有效的类别
  switch (category) {
    case 'about':
      return 'about';
    case 'skill':
      return 'skill';
    case 'featured-article':
      return 'article_link';
    case 'album':
      return 'album_link';
    default:
      return 'default';
  }
}

/**
 * 将文章数据转换为卡片数据
 */
export function formatPostsToCards(posts: Article[]): CardData[] {
  return posts.map(post => {
    const targetUrl = extractLink(post.content);
    const body = removeLink(post.content);
    const category = getCategoryFromTags(post.tags);

    return {
      id: post.id,
      category,
      targetUrl,
      content: {
        title: post.title,
        body,
        thumbnailUrl: post.excerpt || undefined,
      },
    };
  });
}

/**
 * 洗牌算法（Fisher-Yates）
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
