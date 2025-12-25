import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Article, ApiResponse } from '@/types/article';
import MarkdownContent from '@/components/MarkdownContent';
import { generateArticleJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';

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

  // 从内容中提取纯文本作为描述（如果没有 excerpt）
  const description = article.excerpt || 
    article.content
      .replace(/[#*`[\]()]/g, '') // 移除 Markdown 符号
      .substring(0, 160) + '...';

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const articleUrl = `${baseUrl}/articles/${article.slug}`;

  return {
    title: article.title,
    description,
    keywords: [article.title, '博客', '文章'],
    authors: [{ name: '博主' }],
    openGraph: {
      title: article.title,
      description,
      url: articleUrl,
      siteName: '个人博客',
      locale: 'zh_CN',
      type: 'article',
      publishedTime: article.created_at,
      modifiedTime: article.updated_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
    },
    alternates: {
      canonical: articleUrl,
    },
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

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  // 生成 JSON-LD 结构化数据
  const articleJsonLd = generateArticleJsonLd(article, baseUrl);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(
    [
      { name: '首页', url: '/' },
      { name: article.title, url: `/articles/${article.slug}` },
    ],
    baseUrl
  );

  return (
    <>
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

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
    </>
  );
}
