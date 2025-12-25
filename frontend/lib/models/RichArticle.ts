/**
 * RichArticle 模型
 * 扩展 Article 模型，添加富文本内容预处理功能
 */

import { ArticleModel, Article } from './Article';
import { markdownProcessor } from '../utils/markdown-processor';
import type { TocItem, ImageObject } from '../../src/types/rich-article';

export interface RichArticle extends Article {
  htmlContent: string;           // Pre-rendered HTML
  tableOfContents: TocItem[];    // Structured TOC
  readingTime: number;           // Minutes
  contentImages: ImageObject[];  // All images
}

export class RichArticleModel extends ArticleModel {
  /**
   * 从 Article 生成富文本内容
   */
  static generateRichContent(article: Article): RichArticle {
    // 使用 Markdown 预处理器处理内容
    const processed = markdownProcessor.process(article.content);

    return {
      ...article,
      htmlContent: processed.htmlContent,
      tableOfContents: processed.tableOfContents,
      readingTime: processed.readingTime,
      contentImages: processed.contentImages,
    };
  }

  /**
   * 根据 ID 获取富文本文章
   */
  static async findRichById(id: string): Promise<RichArticle | null> {
    const article = await this.findById(id);
    if (!article) return null;

    return this.generateRichContent(article);
  }

  /**
   * 根据 slug 获取富文本文章
   */
  static async findRichBySlug(slug: string): Promise<RichArticle | null> {
    const article = await this.findBySlug(slug);
    if (!article) return null;

    return this.generateRichContent(article);
  }

  /**
   * 获取所有已发布的富文本文章（带分页）
   */
  static async findPublishedRich(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    articles: RichArticle[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const result = await this.findPublished(page, limit);

    const richArticles = result.articles.map((article) =>
      this.generateRichContent(article)
    );

    return {
      ...result,
      articles: richArticles,
    };
  }

  /**
   * 获取所有富文本文章（管理后台用）
   */
  static async findAllRich(): Promise<RichArticle[]> {
    const articles = await this.findAll();
    return articles.map((article) => this.generateRichContent(article));
  }

  /**
   * 批量生成富文本内容（用于性能优化）
   */
  static generateRichContentBatch(articles: Article[]): RichArticle[] {
    return articles.map((article) => this.generateRichContent(article));
  }

  /**
   * 预览富文本内容（不保存到数据库）
   * 用于编辑器实时预览
   */
  static previewRichContent(markdown: string): {
    htmlContent: string;
    tableOfContents: TocItem[];
    readingTime: number;
    contentImages: ImageObject[];
  } {
    const processed = markdownProcessor.process(markdown);

    return {
      htmlContent: processed.htmlContent,
      tableOfContents: processed.tableOfContents,
      readingTime: processed.readingTime,
      contentImages: processed.contentImages,
    };
  }
}
