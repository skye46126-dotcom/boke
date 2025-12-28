import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllTagNames, getArticlesByTag, tagExists } from '@/content/tags';
import FixedThemeToggle from '@/components/FixedThemeToggle';
import '@/styles/articles-list.css';

// 生成静态路径
export function generateStaticParams() {
  const tags = getAllTagNames();
  return tags.map((tag) => ({ tag: encodeURIComponent(tag) }));
}

// 生成 metadata
export async function generateMetadata({
  params,
}: {
  params: { tag: string };
}): Promise<Metadata> {
  const tag = decodeURIComponent(params.tag);
  
  return {
    title: `${tag} - 标签 - 像素开发者`,
    description: `浏览标签「${tag}」下的所有文章`,
  };
}

export default function TagDetailPage({
  params,
}: {
  params: { tag: string };
}) {
  const tag = decodeURIComponent(params.tag);
  
  if (!tagExists(tag)) {
    notFound();
  }
  
  const articles = getArticlesByTag(tag);

  return (
    <div className="articles-page" style={{ 
      background: 'var(--color-background)', 
      minHeight: '100vh',
      transition: 'background 0.3s ease',
      position: 'relative'
    }}>
      <FixedThemeToggle />
      
      <div className="container mx-auto px-4 py-8">
        <header style={{ marginBottom: '32px' }}>
          <Link 
            href="/tags" 
            className="back-to-tags"
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '20px',
              padding: '8px 16px',
              background: 'rgba(158, 127, 102, 0.1)',
              border: '1px solid rgba(158, 127, 102, 0.3)',
              borderRadius: '6px',
              color: '#7A6248',
              fontSize: '14px',
              fontFamily: "'Noto Serif SC', Georgia, serif",
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            ← 返回标签
          </Link>
          <h1 style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '24px',
            fontFamily: "'Noto Serif SC', Georgia, serif",
            fontWeight: 600,
            color: '#5D4E3C',
            margin: '0 0 12px 0'
          }}>
            <span style={{
              display: 'inline-block',
              padding: '6px 14px',
              background: 'linear-gradient(135deg, #9E7F66 0%, #8A6B52 100%)',
              color: '#fff',
              fontSize: '14px',
              fontFamily: "'Noto Serif SC', Georgia, serif",
              fontWeight: 500,
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(158, 127, 102, 0.3)'
            }}>
              {tag}
            </span>
            相关文章
          </h1>
          <p style={{ 
            fontSize: '14px',
            fontFamily: "'Noto Serif SC', Georgia, serif",
            color: '#8B7355',
            margin: 0
          }}>
            共 {articles.length} 篇文章
          </p>
        </header>

        {articles.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '48px',
            color: '#8B7355',
            fontFamily: "'Noto Serif SC', Georgia, serif",
            fontSize: '16px'
          }}>
            该标签下暂无文章
          </div>
        ) : (
          <div className="articles-grid">
            {articles.map((article) => (
              <Link 
                key={article.slug} 
                href={`/articles/${article.slug}`}
                className="article-card"
              >
                <h2 className="article-title">{article.title}</h2>
                <p className="article-date">
                  {new Date(article.date).toLocaleDateString('zh-CN')}
                </p>
                {article.excerpt && (
                  <p className="article-excerpt">{article.excerpt}</p>
                )}
                {article.tags.length > 0 && (
                  <div className="article-tags">
                    {article.tags.map((t) => (
                      <span 
                        key={t} 
                        className="article-tag"
                        style={t === tag ? { 
                          background: 'rgba(158, 127, 102, 0.25)',
                          borderColor: 'rgba(158, 127, 102, 0.5)'
                        } : {}}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
