'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ArticleEditor from '@/components/ArticleEditor';

export default function NewArticle() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

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
      const res = await fetch(`/api/manage/${adminPath}/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create article');
      }

      alert('文章创建成功！');
      router.push('/admin');
    } catch (err) {
      alert('创建失败: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm('确定要取消吗？未保存的内容将丢失。')) {
      router.push('/admin');
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>新建文章</h1>
      </header>

      <ArticleEditor
        onSave={handleSave}
        onCancel={handleCancel}
        saving={saving}
      />
    </div>
  );
}
