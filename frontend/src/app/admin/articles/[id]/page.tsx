'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ArticleEditor from '@/components/ArticleEditor';
import { Article, ApiResponse } from '@/types/article';

export default function EditArticle({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const adminPath = localStorage.getItem('adminPath');
    if (!adminPath) {
      router.push('/admin/login');
      return;
    }

    const loadArticle = async () => {
      try {
        const res = await fetch(`/api/manage/${adminPath}/articles/${params.id}`);
        
        if (!res.ok) {
          throw new Error('Failed to fetch article');
        }

        const data: ApiResponse<Article> = await res.json();
        setArticle(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [params.id, router]);

  const handleSave = async (data: {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    status: 'draft' | 'published';
  }) => {
    const adminPath = localStorage.getItem('adminPath');
    if (!adminPath) {
      alert('请先登录');
      router.push('/admin/login');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/manage/${adminPath}/articles/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update article');
      }

      alert('文章更新成功！');
      router.push('/admin');
    } catch (err) {
      alert('更新失败: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm('确定要取消吗？未保存的修改将丢失。')) {
      router.push('/admin');
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="admin-container">
        <div className="error-message">
          {error || '文章未找到'}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>编辑文章</h1>
      </header>

      <ArticleEditor
        initialTitle={article.title}
        initialSlug={article.slug}
        initialContent={article.content}
        initialExcerpt={article.excerpt}
        initialStatus={article.status}
        onSave={handleSave}
        onCancel={handleCancel}
        saving={saving}
      />
    </div>
  );
}
