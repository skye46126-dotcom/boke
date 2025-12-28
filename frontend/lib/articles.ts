/**
 * 文章数据读取层
 * 从 /content/articles/ 目录读取 Markdown 文件
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// 文章目录路径
const articlesDirectory = path.join(process.cwd(), 'content/articles');

// 文章类型定义
export interface Article {
  slug: string;
  title: string;
  date: string;
  status: 'published' | 'draft';
  excerpt?: string;
  cover_image?: string;
  tags: string[];
  content: string;      // 原始 Markdown 内容
}

// 文章元数据（不含内容）
export interface ArticleMeta {
  slug: string;
  title: string;
  date: string;
  status: 'published' | 'draft';
  excerpt?: string;
  cover_image?: string;
  tags: string[];
}

/**
 * 获取所有文章文件名
 */
function getArticleFiles(): string[] {
  try {
    return fs.readdirSync(articlesDirectory).filter(file => file.endsWith('.md'));
  } catch {
    return [];
  }
}

/**
 * 解析单个文章文件
 */
function parseArticleFile(filename: string): Article | null {
  try {
    const filePath = path.join(articlesDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    // 从文件名提取 slug（如果 frontmatter 中没有）
    const slug = data.slug || filename.replace(/\.md$/, '');

    return {
      slug,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString().split('T')[0],
      status: data.status === 'draft' ? 'draft' : 'published',
      excerpt: data.excerpt || '',
      cover_image: data.cover_image || null,
      tags: Array.isArray(data.tags) ? data.tags : [],
      content,
    };
  } catch (error) {
    console.error(`Error parsing article file ${filename}:`, error);
    return null;
  }
}

/**
 * 获取所有文章（包括草稿）
 */
export function getArticles(): Article[] {
  const files = getArticleFiles();
  const articles = files
    .map(parseArticleFile)
    .filter((article): article is Article => article !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return articles;
}

/**
 * 获取所有已发布的文章
 */
export function getPublishedArticles(): Article[] {
  return getArticles().filter(article => article.status === 'published');
}

/**
 * 根据 slug 获取单篇文章
 */
export function getArticleBySlug(slug: string): Article | null {
  const articles = getArticles();
  return articles.find(article => article.slug === slug) || null;
}

/**
 * 获取所有文章的元数据（不含内容，用于列表页）
 */
export function getArticlesMeta(): ArticleMeta[] {
  return getArticles().map(({ content, ...meta }) => meta);
}

/**
 * 获取所有已发布文章的元数据
 */
export function getPublishedArticlesMeta(): ArticleMeta[] {
  return getPublishedArticles().map(({ content, ...meta }) => meta);
}

/**
 * 获取所有文章的 slug（用于 generateStaticParams）
 */
export function getAllArticleSlugs(): string[] {
  return getPublishedArticles().map(article => article.slug);
}
