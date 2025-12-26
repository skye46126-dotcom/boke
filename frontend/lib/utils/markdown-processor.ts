/**
 * Markdown 预处理器
 * 支持自定义语法、目录提取、阅读时间计算和图片处理
 */

import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

// 类型定义
export interface TocItem {
  level: number;      // 1-6 for H1-H6
  text: string;       // Heading text
  id: string;         // Anchor ID
}

export interface ImageObject {
  alt: string;
  src: {
    original: string;
    large?: string;
    medium?: string;
    small?: string;
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

export interface ProcessedMarkdown {
  htmlContent: string;
  tableOfContents: TocItem[];
  readingTime: number;
  contentImages: ImageObject[];
}

/**
 * Markdown 预处理器类
 */
export class MarkdownProcessor {
  private headingIds: Set<string> = new Set();

  /**
   * 处理自定义语法
   * 支持：
   * - 图片破格布局：![alt](url){.breakout} 或 ![alt](url){.full-width}
   * - 图片宽度：![alt](url){width="600"}
   * - 代码块标题：```language{title="标题"}
   * - 图片标题：![alt](url "caption")
   */
  processCustomSyntax(markdown: string): string {
    let processed = markdown;

    // 处理图片宽度：![alt](url){width="600"}
    processed = processed.replace(
      /!\[([^\]]*)\]\(([^)]+)\)\{width="(\d+)"\}/g,
      (match, alt, url, width) => {
        return `<img src="${url}" alt="${alt}" width="${width}" loading="lazy" />`;
      }
    );

    // 处理图片破格布局：![alt](url){.breakout}
    processed = processed.replace(
      /!\[([^\]]*)\]\(([^)]+)\)\{\.breakout\}/g,
      (match, alt, url) => {
        return `<img src="${url}" alt="${alt}" class="breakout" loading="lazy" />`;
      }
    );

    // 处理图片破格布局：![alt](url){.full-width}
    processed = processed.replace(
      /!\[([^\]]*)\]\(([^)]+)\)\{\.full-width\}/g,
      (match, alt, url) => {
        return `<img src="${url}" alt="${alt}" class="full-width" loading="lazy" />`;
      }
    );

    // 处理带标题的图片：![alt](url "caption")
    processed = processed.replace(
      /!\[([^\]]*)\]\(([^)]+)\s+"([^"]+)"\)/g,
      (match, alt, url, caption) => {
        return `<figure><img src="${url}" alt="${alt}" loading="lazy" /><figcaption>${caption}</figcaption></figure>`;
      }
    );

    // 处理代码块标题：```language{title="标题"}
    processed = processed.replace(
      /```(\w+)\{title="([^"]+)"\}\n/g,
      (match, language, title) => {
        return `<div class="code-block-wrapper" data-title="${title}">\n\`\`\`${language}\n`;
      }
    );

    // 为带标题的代码块添加闭合标签
    processed = processed.replace(
      /```\n<\/div>/g,
      '```\n</div>'
    );

    return processed;
  }

  /**
   * 生成唯一的标题 ID
   */
  private generateHeadingId(text: string): string {
    // 移除 HTML 标签
    const cleanText = text.replace(/<[^>]*>/g, '');
    
    // 转换为 slug
    let slug = cleanText
      .toLowerCase()
      .trim()
      .replace(/[\s\u4e00-\u9fa5]+/g, '-') // 中文和空格转为连字符
      .replace(/[^\w-\u4e00-\u9fa5]+/g, '') // 移除特殊字符
      .replace(/--+/g, '-') // 多个连字符合并
      .replace(/^-+/, '') // 移除开头的连字符
      .replace(/-+$/, ''); // 移除结尾的连字符

    // 如果为空，使用默认值
    if (!slug) {
      slug = 'heading';
    }

    // 确保唯一性
    let uniqueSlug = slug;
    let counter = 1;
    while (this.headingIds.has(uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    this.headingIds.add(uniqueSlug);
    return uniqueSlug;
  }

  /**
   * 配置 marked 渲染器
   */
  private configureMarked(): void {
    const self = this; // 保存 this 引用
    
    // 使用 marked 的 hooks 来自定义渲染
    marked.use({
      renderer: {
        heading(text: string, level: number) {
          const safeText = text || '';
          const id = self.generateHeadingId(safeText);
          return `<h${level} id="${id}">${safeText}</h${level}>\n`;
        },
        code(code: string, language: string | undefined) {
          const safeCode = code || '';
          const safeLang = language || 'plaintext';
          return `<pre><code class="language-${safeLang}">${self.escapeHtml(safeCode)}</code></pre>\n`;
        },
        image(href: string, title: string | null, text: string) {
          const safeHref = href || '';
          const safeTitle = title || '';
          const safeText = text || '';
          const titleAttr = safeTitle ? ` title="${safeTitle}"` : '';
          return `<img src="${safeHref}" alt="${safeText}"${titleAttr} loading="lazy" />`;
        },
        link(href: string, title: string | null | undefined, text: string) {
          const safeHref = href || '';
          const safeTitle = title || '';
          const safeText = text || '';
          const isExternal = safeHref.startsWith('http://') || safeHref.startsWith('https://');
          const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
          const titleAttr = safeTitle ? ` title="${safeTitle}"` : '';
          return `<a href="${safeHref}"${titleAttr}${target}>${safeText}</a>`;
        },
      },
    });

    marked.setOptions({
      gfm: true,
      breaks: true,
    });
  }

  /**
   * 转义 HTML
   */
  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }

  /**
   * 解析 Markdown 为 HTML
   */
  parse(markdown: string): string {
    // 重置标题 ID 集合
    this.headingIds.clear();

    // 配置 marked
    this.configureMarked();

    // 处理自定义语法
    const processedMarkdown = this.processCustomSyntax(markdown);

    // 渲染 Markdown
    const rawHtml = marked(processedMarkdown) as string;

    // 清理 HTML（安全性）
    const cleanHtml = DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'hr',
        'strong', 'em', 'u', 's', 'del',
        'a', 'img',
        'ul', 'ol', 'li',
        'blockquote', 'pre', 'code',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'figure', 'figcaption',
        'div', 'span',
      ],
      ALLOWED_ATTR: [
        'href', 'title', 'target', 'rel',
        'src', 'alt', 'width', 'height', 'loading',
        'class', 'id', 'data-title',
      ],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.-]+(?:[^a-z+.:-]|$))/i,
    });

    return cleanHtml;
  }

  /**
   * 从 HTML 提取目录
   */
  extractToc(html: string): TocItem[] {
    const toc: TocItem[] = [];
    const headingRegex = /<h([1-6])\s+id="([^"]+)">([^<]+)<\/h[1-6]>/g;
    
    let match;
    while ((match = headingRegex.exec(html)) !== null) {
      const level = parseInt(match[1], 10);
      const id = match[2];
      const text = match[3];

      toc.push({
        level,
        id,
        text,
      });
    }

    return toc;
  }

  /**
   * 计算阅读时间（分钟）
   * 基于平均阅读速度：中文 300-500 字/分钟，英文 200-250 词/分钟
   */
  calculateReadingTime(text: string): number {
    // 移除 Markdown 语法
    const cleanText = text
      .replace(/```[\s\S]*?```/g, '') // 移除代码块
      .replace(/`[^`]+`/g, '') // 移除行内代码
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 移除图片
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 保留链接文本
      .replace(/[#*_~`]/g, '') // 移除 Markdown 符号
      .replace(/\n+/g, ' '); // 换行转空格

    // 统计中文字符
    const chineseChars = (cleanText.match(/[\u4e00-\u9fa5]/g) || []).length;
    
    // 统计英文单词
    const englishWords = cleanText
      .replace(/[\u4e00-\u9fa5]/g, '') // 移除中文
      .split(/\s+/)
      .filter(word => word.length > 0).length;

    // 计算阅读时间
    const chineseReadingTime = chineseChars / 400; // 400 字/分钟
    const englishReadingTime = englishWords / 225; // 225 词/分钟
    const totalMinutes = chineseReadingTime + englishReadingTime;

    // 至少 1 分钟
    return Math.max(1, Math.ceil(totalMinutes));
  }

  /**
   * 从 HTML 提取图片信息
   */
  extractImages(html: string): ImageObject[] {
    const images: ImageObject[] = [];
    const imgRegex = /<img\s+([^>]+)>/g;
    
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      const attrs = match[1];
      
      // 提取属性
      const srcMatch = attrs.match(/src="([^"]+)"/);
      const altMatch = attrs.match(/alt="([^"]*)"/);
      const classMatch = attrs.match(/class="([^"]+)"/);

      if (srcMatch) {
        const src = srcMatch[1];
        const alt = altMatch ? altMatch[1] : '';
        const classes = classMatch ? classMatch[1] : '';

        // 确定布局类型
        let layout: 'default' | 'breakout' | 'full-width' = 'default';
        if (classes.includes('breakout')) {
          layout = 'breakout';
        } else if (classes.includes('full-width')) {
          layout = 'full-width';
        }

        images.push({
          alt,
          src: {
            original: src,
          },
          layout,
        });
      }
    }

    // 处理 figure 标签中的图片（带标题）
    const figureRegex = /<figure>[\s\S]*?<img\s+([^>]+)>[\s\S]*?<figcaption>([^<]+)<\/figcaption>[\s\S]*?<\/figure>/g;
    
    while ((match = figureRegex.exec(html)) !== null) {
      const attrs = match[1];
      const caption = match[2];
      
      const srcMatch = attrs.match(/src="([^"]+)"/);
      const altMatch = attrs.match(/alt="([^"]*)"/);

      if (srcMatch) {
        const src = srcMatch[1];
        const alt = altMatch ? altMatch[1] : '';

        images.push({
          alt,
          src: {
            original: src,
          },
          caption,
          layout: 'default',
        });
      }
    }

    return images;
  }

  /**
   * 完整处理 Markdown
   */
  process(markdown: string): ProcessedMarkdown {
    const htmlContent = this.parse(markdown);
    const tableOfContents = this.extractToc(htmlContent);
    const readingTime = this.calculateReadingTime(markdown);
    const contentImages = this.extractImages(htmlContent);

    return {
      htmlContent,
      tableOfContents,
      readingTime,
      contentImages,
    };
  }
}

// 导出单例实例
export const markdownProcessor = new MarkdownProcessor();
