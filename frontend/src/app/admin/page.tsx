'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Article, ApiResponse } from '@/types/article';
import ThemeToggle from '@/components/ThemeToggle';

export default function AdminDashboard() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0 });
  const [adminPath, setAdminPath] = useState<string>('');

  useEffect(() => {
    // 从 localStorage 获取 adminPath
    const savedAdminPath = localStorage.getItem('adminPath');
    if (!savedAdminPath) {
      router.push('/admin/login');
      return;
    }
    setAdminPath(savedAdminPath);
    fetchData(savedAdminPath);
  }, [router]);

  const fetchData = async (path: string) => {
    try {
      setLoading(true);
      
      // 获取文章列表
      const articlesRes = await fetch(`/api/manage/${path}/articles`);
      if (!articlesRes.ok) {
        throw new Error('Failed to fetch articles');
      }
      const articlesData: ApiResponse<Article[]> = await articlesRes.json();
      setArticles(articlesData.data);

      // 获取统计信息
      const statsRes = await fetch(`/api/manage/${path}/stats`);
      if (!statsRes.ok) {
        throw new Error('Failed to fetch stats');
      }
      const statsData: ApiResponse<{ total: number; published: number; draft: number }> = await statsRes.json();
      setStats(statsData.data);

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇文章吗？')) {
      return;
    }

    try {
      const res = await fetch(`/api/manage/${adminPath}/articles/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete article');
      }

      // 刷新列表
      fetchData(adminPath);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete article');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminPath');
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="error-message">错误: {error}</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>文章管理</h1>
        <div className="admin-actions">
          <ThemeToggle variant="segmented" size="sm" />
          <Link href="/admin/articles/new" className="btn btn-primary">
            新建文章
          </Link>
          <button onClick={handleLogout} className="btn btn-secondary">
            退出
          </button>
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">总文章数</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.published}</div>
          <div className="stat-label">已发布</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.draft}</div>
          <div className="stat-label">草稿</div>
        </div>
      </div>

      <div className="articles-table-container">
        <table className="articles-table">
          <thead>
            <tr>
              <th>标题</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>更新时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-row">
                  暂无文章
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id}>
                  <td className="article-title-cell">
                    <Link href={`/admin/articles/${article.id}`}>
                      {article.title}
                    </Link>
                  </td>
                  <td>
                    <span className={`status-badge status-${article.status}`}>
                      {article.status === 'published' ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="date-cell">
                    {new Date(article.created_at).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="date-cell">
                    {new Date(article.updated_at).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="actions-cell">
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="btn-link btn-edit"
                    >
                      编辑
                    </Link>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="btn-link btn-delete"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
