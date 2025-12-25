import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { RichArticle } from '@/types/rich-article';
import RichMarkdownContent from '@/components/RichMarkdownContent';
import MagneticLink from '@/components/MagneticLink';
import ArticleLayout from '@/components/ArticleLayout';
import { generateArticleJsonLd, generateBreadcrumbJsonLd } from '@/lib/seo';

async function getRichArticle(slug: string): Promise<RichArticle | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/articles/${slug}/rich`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const response = await res.json();
    return response.data;
  } catch (error) {
    console.error('Error fetching rich article:', error);
    return null;
  }
}

// 生成动态 metadata
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getRichArticle(params.slug);

  if (!article) {
    return {
      title: '文章未找到',
      description: '您访问的文章不存在或已被删除',
    };
  }

  const description = article.excerpt || 
    article.htmlContent
      .replace(/<[^>]*>/g, '') // 移除 HTML 标签
      .replace(/\s+/g, ' ') // 合并空白
      .trim()
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
  const article = await getRichArticle(params.slug);

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
        <ArticleLayout tableOfContents={article.tableOfContents}>
          <article className="article-detail">
            <header className="article-header">
              <MagneticLink 
                href="/" 
                className="back-link"
                config={{ strength: 0.2, radius: 80 }}
              >
                ← 返回首页
              </MagneticLink>
              
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
                <span className="reading-time">
                  阅读时间 {article.readingTime} 分钟
                </span>
              </div>
            </header>

            <div className="article-content">
              <RichMarkdownContent 
                htmlContent={article.htmlContent}
                tableOfContents={article.tableOfContents}
              />
            </div>
          </article>
        </ArticleLayout>
      </main>
    </>
  );
}
