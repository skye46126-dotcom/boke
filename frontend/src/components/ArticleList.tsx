'use client';

import Link from 'next/link';
import { Article } from '@/types/article';

interface ArticleListProps {
  articles: Article[];
}

export default function ArticleList({ articles }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="empty-state" style={{ color: 'var(--color-text-muted)' }}>
        <p>暂无文章</p>
      </div>
    );
  }

  return (
    <div className="article-list">
      {articles.map((article) => (
        <article 
          key={article.id} 
          className="article-card"
          style={{
            background: 'var(--color-surface-raised, #fff)',
            borderColor: 'var(--color-border, #e0e0e0)',
            transition: 'all 0.3s ease'
          }}
        >
          <Link href={`/articles/${article.slug}`} className="article-link">
            <h2 
              className="article-title"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {article.title}
            </h2>
            {article.excerpt && (
              <p 
                className="article-excerpt"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {article.excerpt}
              </p>
            )}
            <div 
              className="article-meta"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <time dateTime={article.created_at}>
                {new Date(article.created_at).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
