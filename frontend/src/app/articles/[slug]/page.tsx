import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Article } from '@/types/article';
import { marked } from 'marked';

async function getArticle(slug: string): Promise<Article | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  
  try {
    const res = await fetch(`${baseUrl}/api/articles/${slug}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const response = await res.json();
    return response.data;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// 简单的Markdown渲染函数
function renderMarkdown(markdown: string): string {
  // 配置marked
  marked.setOptions({
    gfm: true,
    breaks: true,
  });
  
  return marked(markdown) as string;
}

// 生成动态 metadata
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticle(params.slug);

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
    keywords: [article.title, '博客', '文章'],
    authors: [{ name: '博主' }],
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  // 渲染Markdown内容
  const htmlContent = renderMarkdown(article.content);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <article className="article-detail">
        <header className="article-header mb-8">
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          
          <div className="text-gray-600 mb-4">
            <time dateTime={article.created_at}>
              发布于 {new Date(article.created_at).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            {article.updated_at !== article.created_at && (
              <span className="ml-4">
                更新于 {new Date(article.updated_at).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>
          
          {article.excerpt && (
            <p className="text-lg text-gray-700 mb-6">{article.excerpt}</p>
          )}
        </header>

        <div className="article-content prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      </article>
    </div>
  );
}
