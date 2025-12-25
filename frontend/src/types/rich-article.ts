/**
 * 富文本文章类型定义
 * 包含预处理的 HTML、目录、阅读时间和图片信息
 */

import { Article } from './article';

export interface TocItem {
  level: number;      // 1-6 for H1-H6
  text: string;       // Heading text
  id: string;         // Anchor ID
}

export interface ImageObject {
  alt: string;
  src: {
    original: string;
    large?: string;     // 1200px
    medium?: string;    // 800px
    small?: string;     // 400px
  };
  placeholder?: {
    type: 'blurhash' | 'lqip';
    hash: string;
  };
  caption?: string;
  layout: 'default' | 'breakout' | 'full-width';
  width?: number;
  height?: number;
}

export interface RichArticle extends Article {
  htmlContent: string;           // Pre-rendered HTML
  tableOfContents: TocItem[];    // Structured TOC
  readingTime: number;           // Minutes
  contentImages: ImageObject[];  // All images
  published_at: string | null;   // 添加 published_at 字段
}

export interface RichArticleApiResponse {
  success: boolean;
  data: RichArticle;
}
