/* eslint-disable no-unused-vars */
'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import MarkdownContent from './MarkdownContent';

interface ArticleEditorProps {
  initialTitle?: string;
  initialSlug?: string;
  initialContent?: string;
  initialExcerpt?: string;
  initialStatus?: 'draft' | 'published';
  onSave: (_data: {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    status: 'draft' | 'published';
  }) => Promise<void>;
  onCancel: () => void;
  saving?: boolean;
}

export default function ArticleEditor({
  initialTitle = '',
  initialSlug = '',
  initialContent = '',
  initialExcerpt = '',
  initialStatus = 'draft',
  onSave,
  onCancel,
  saving = false,
}: ArticleEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialSlug);
  const [content, setContent] = useState(initialContent);
  const [excerpt, setExcerpt] = useState(initialExcerpt);
  const [status, setStatus] = useState<'draft' | 'published'>(initialStatus);
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // 自动生成 slug
    if (!slug && title) {
      const generatedSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s\u4e00-\u9fa5-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  }, [title, slug]);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const adminPath = localStorage.getItem('adminPath');
    if (!adminPath) {
      alert('请先登录');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`/api/manage/${adminPath}/upload/image`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      
      // 插入 Markdown 图片语法到光标位置
      const markdown = data.data.markdown;
      setContent((prev) => prev + '\n\n' + markdown + '\n\n');
      
      alert('图片上传成功！');
    } catch (err) {
      alert('图片上传失败: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setUploading(false);
      // 重置 input
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('请输入标题');
      return;
    }
    
    if (!content.trim()) {
      alert('请输入内容');
      return;
    }

    await onSave({
      title: title.trim(),
      slug: slug.trim() || title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim(),
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="article-editor">
      <div className="editor-toolbar">
        <div className="toolbar-left">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="btn btn-secondary"
          >
            {showPreview ? '编辑' : '预览'}
          </button>
          
          <label className="btn btn-secondary upload-btn">
            {uploading ? '上传中...' : '上传图片'}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        <div className="toolbar-right">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={saving}
          >
            取消
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      {!showPreview ? (
        <div className="editor-form">
          <div className="form-group">
            <label htmlFor="title">标题 *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              placeholder="输入文章标题"
              required
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="slug">URL Slug</label>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="form-input"
              placeholder="自动生成或手动输入"
              disabled={saving}
            />
            <small className="form-hint">
              留空将自动从标题生成
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="excerpt">摘要</label>
            <input
              type="text"
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="form-input"
              placeholder="简短描述文章内容"
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">状态 *</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
              className="form-select"
              disabled={saving}
            >
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="content">内容 * (Markdown)</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-textarea"
              placeholder="使用 Markdown 格式编写内容..."
              required
              disabled={saving}
            />
            <small className="form-hint">
              支持 Markdown 语法，包括标题、列表、链接、图片、代码块等
            </small>
          </div>
        </div>
      ) : (
        <div className="editor-preview">
          <h1 className="preview-title">{title || '未命名文章'}</h1>
          {excerpt && <p className="preview-excerpt">{excerpt}</p>}
          <div className="preview-content">
            <MarkdownContent content={content || '*暂无内容*'} />
          </div>
        </div>
      )}
    </form>
  );
}
