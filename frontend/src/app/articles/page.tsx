import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedArticlesMeta } from '@/content/articles';
import FixedThemeToggle from '@/components/FixedThemeToggle';
import '@/styles/articles-list.css';

export const metadata: Metadata = {
  title: '文章列表 - 像素开发者',
  description: '浏览所有技术文章和博客内容',
};

export default function ArticlesPage() {
  const articles = getPublishedArticlesMeta();

  return (
    <div className="articles-page" style={{ 
      background: 'var(--color-background)', 
      minHeight: '100vh',
      transition: 'background 0.3s ease',
      position: 'relative'
    }}>
      {/* 右上角主题切换 */}
      <FixedThemeToggle />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-text-primary)' }}>
          文章列表
        </h1>
        
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: 'var(--color-text-secondary)' }}>暂无文章</p>
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
                <p className="article-excerpt">{article.excerpt || ''}</p>
                <div className="article-tags">
                  {article.tags.map((tag) => (
                    <span key={tag} className="article-tag">{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
