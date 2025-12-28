/**
 * 标签系统
 * 从文章中提取和聚合标签
 */

import { getPublishedArticles, Article } from './articles';

// 标签信息类型
export interface TagInfo {
  name: string;
  count: number;
}

/**
 * 获取所有标签及其文章数量
 */
export function getAllTags(): TagInfo[] {
  const articles = getPublishedArticles();
  const tagCounts = new Map<string, number>();

  articles.forEach(article => {
    article.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count); // 按数量降序排列
}

/**
 * 获取指定标签的所有文章
 */
export function getArticlesByTag(tag: string): Article[] {
  const articles = getPublishedArticles();
  return articles.filter(article => article.tags.includes(tag));
}

/**
 * 获取所有标签名称（用于 generateStaticParams）
 */
export function getAllTagNames(): string[] {
  return getAllTags().map(tag => tag.name);
}

/**
 * 检查标签是否存在
 */
export function tagExists(tag: string): boolean {
  const tags = getAllTags();
  return tags.some(t => t.name === tag);
}
