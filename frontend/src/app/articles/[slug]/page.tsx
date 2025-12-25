import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Article, ApiResponse } from '@/types/article';
import MarkdownContent from '@/components/MarkdownContent';

async function getArticle(slug: string): Promise<Article | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/articles/${slug}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const response: ApiResponse<Article> = await res.json();
    return response.data;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
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

  return (
    <main className="container">
      <article className="article-detail">
        <header className="article-header">
          <Link href="/" className="back-link">
            ← 返回首页
          </Link>
          
          <h1 className="article-detail-title">{article.title}</h1>
          
          <div className="article-detail-meta">
            <time dateTime={article.created_at}>
              发布于 {new Date(article.created_at).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            {article.updated_at !== article.created_at && (
              <span className="updated-time">
                更新于 {new Date(article.updated_at).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            )}
          </div>
        </header>

        <div className="article-content">
          <MarkdownContent content={article.content} />
        </div>
      </article>
    </main>
  );
}
