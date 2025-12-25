'use client';

import Link from 'next/link';
import { Article } from '@/types/article';

interface ArticleListProps {
  articles: Article[];
}

export default function ArticleList({ articles }: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="empty-state">
        <p>暂无文章</p>
      </div>
    );
  }

  return (
    <div className="article-list">
      {articles.map((article) => (
        <article key={article.id} className="article-card">
          <Link href={`/articles/${article.slug}`} className="article-link">
            <h2 className="article-title">{article.title}</h2>
            {article.excerpt && (
              <p className="article-excerpt">{article.excerpt}</p>
            )}
            <div className="article-meta">
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
