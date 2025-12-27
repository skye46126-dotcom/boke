'use client';

import { useState, useEffect } from 'react';
import ArticleList from '@/components/ArticleList';
import { Article } from '@/types/article';

export default function ArticlesClient() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/articles`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setArticles(data.data.articles || []);
        } else {
          throw new Error(data.message || 'Failed to fetch articles');
        }
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div 
          className="animate-spin rounded-full h-8 w-8 border-b-2"
          style={{ borderColor: 'var(--color-text-primary)' }}
        ></div>
        <span className="ml-2" style={{ color: 'var(--color-text-secondary)' }}>加载中...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="mb-4" style={{ color: 'var(--color-error, #ef4444)' }}>加载文章时出错: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 rounded"
          style={{ 
            background: 'var(--color-accent)', 
            color: '#fff',
            transition: 'background 0.2s ease'
          }}
        >
          重试
        </button>
      </div>
    );
  }

  return <ArticleList articles={articles} />;
}