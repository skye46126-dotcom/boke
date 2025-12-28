import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getArticleBySlug, getAllArticleSlugs } from '@/content/articles';
import { TocItem } from '@/types/rich-article';
import { marked } from 'marked';
import ArticleLeftSidebar from '@/components/ArticleLeftSidebar';
import '@/styles/article-vintage.css';

// 生成静态路径
export function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

// 从Markdown提取目录
function extractToc(markdown: string): TocItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: TocItem[] = [];
  let match;
  
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-|-$/g, '');
    
    toc.push({ level, text, id });
  }
  
  // 兜底：如果没有提取到目录但有内容，添加默认项
  if (toc.length === 0 && markdown) {
    toc.push({ level: 1, text: '文章正文', id: 'article-content' });
  }
  
  return toc;
}

// 简单的Markdown渲染函数
function renderMarkdown(markdown: string): string {
  // 配置marked，添加heading ID
  marked.setOptions({
    gfm: true,
    breaks: true,
  });
  
  // 自定义renderer添加heading ID
  const renderer = new marked.Renderer();
  renderer.heading = (text, level) => {
    const id = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-|-$/g, '');
    return `<h${level} id="${id}">${text}</h${level}>`;
  };
  
  return marked(markdown, { renderer }) as string;
}

// 生成动态 metadata
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: '文章未找到',
      description: '您访问的文章不存在或已被删除',
    };
  }

  const description = article.excerpt || 
    article.content
      .replace(/<[^>]*>/g, '') // 移除 HTML 标签
      .replace(/\s+/g, ' ') // 合并空白
      .trim()
      .substring(0, 160) + '...';

  return {
    title: article.title,
    description,
    keywords: [article.title, '博客', '文章', ...article.tags],
    authors: [{ name: '博主' }],
  };
}

export default function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = getArticleBySlug(params.slug);

  if (!article || article.status === 'draft') {
    notFound();
  }

  // 渲染Markdown内容并提取目录
  const htmlContent = renderMarkdown(article.content);
  const tableOfContents = extractToc(article.content);

  return (
    <>
      {/* 左侧侧边栏 */}
      <ArticleLeftSidebar
        tableOfContents={tableOfContents}
        backUrl="/articles"
        backText="返回文章"
      />
      
      <div className="max-w-4xl mx-auto px-4 py-8" style={{ marginLeft: '20px', transition: 'margin-left 0.3s ease' }}>
        <article className="article-detail">
          <header className="article-header mb-8">
            <h1 className="article-detail-title text-4xl font-bold mb-4">{article.title}</h1>
            
            {/* 文章元信息 */}
            <div className="article-detail-meta mb-4">
              <time dateTime={article.date}>
                发布于 {new Date(article.date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
            
            {/* 标签 */}
            {article.tags.length > 0 && (
              <div className="article-tags mb-4" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {article.tags.map((tag) => (
                  <Link 
                    key={tag} 
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="article-tag"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
            
            {article.excerpt && (
              <p className="text-lg mb-6" style={{ color: 'var(--color-text-secondary)' }}>{article.excerpt}</p>
            )}
          </header>

          <div className="article-content prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>
        </article>
      </div>
    </>
  );
}
