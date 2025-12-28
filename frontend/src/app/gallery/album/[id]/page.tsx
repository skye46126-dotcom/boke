'use client';

/**
 * 图片集详情页（像素风格）
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { GalleryItem, GalleryAlbum } from '@/types/gallery';
import '@/styles/gallery-pixel.css';

const API_URL = 'http://localhost:3001';

export default function AlbumDetailPage() {
  const params = useParams();
  const albumId = params.id as string;
  
  const [album, setAlbum] = useState<GalleryAlbum | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    async function fetchAlbum() {
      try {
        const res = await fetch(`${API_URL}/api/gallery/albums/${albumId}`);
        if (!res.ok) throw new Error('图片集不存在');
        const data = await res.json();
        if (data.success) {
          setAlbum(data.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载失败');
      } finally {
        setLoading(false);
      }
    }
    fetchAlbum();
  }, [albumId]);

  const handleClosePreview = useCallback(() => setPreviewItem(null), []);

  // ESC 关闭预览
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClosePreview();
    };
    if (previewItem) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [previewItem, handleClosePreview]);

  if (loading) {
    return (
      <main className="gallery-page">
        <div className="pixel-loading">
          <div className="pixel-loading-spinner" />
          <p>加载中...</p>
        </div>
      </main>
    );
  }

  if (error || !album) {
    return (
      <main className="gallery-page">
        <div className="pixel-empty-state">
          <p>{error || '图片集不存在'}</p>
          <Link href="/gallery" className="pixel-toggle-btn" style={{ marginTop: '16px', display: 'inline-flex' }}>
            ← 返回相册
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="gallery-page">
      {/* 头部 - 像素风格 */}
      <header className="gallery-page-header">
        <Link href="/gallery" className="pixel-filter-btn" style={{ marginBottom: '16px', display: 'inline-block' }}>
          ← 返回相册
        </Link>
        <h1>📁 {album.name}</h1>
        {album.description && (
          <p style={{ 
            fontFamily: "'Courier New', monospace", 
            fontSize: '13px', 
            color: 'var(--color-text-secondary)',
            marginTop: '8px'
          }}>
            {album.description}
          </p>
        )}
        <span className="pixel-category-tag" style={{ marginTop: '8px', display: 'inline-block' }}>
          {album.image_count} 张图片
        </span>
      </header>

      {/* 图片网格 */}
      {album.images && album.images.length > 0 ? (
        <div className="pixel-gallery-grid">
          {album.images.map((item) => (
            <div
              key={item.id}
              className="pixel-gallery-item"
              onClick={() => setPreviewItem(item)}
            >
              <img
                src={item.img_url}
                alt={item.title}
                loading="lazy"
                style={{ maxHeight: '300px', objectFit: 'cover' }}
              />
              <div className="pixel-item-info">
                <h3>{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="pixel-empty-state">该图片集暂无图片</div>
      )}

      {/* 图片预览弹窗 */}
      {previewItem && (
        <div className="pixel-preview-overlay" onClick={handleClosePreview}>
          <button className="pixel-preview-close" onClick={handleClosePreview}>
            ×
          </button>
          <div className="pixel-preview-content" onClick={(e) => e.stopPropagation()}>
            <img src={previewItem.img_url} alt={previewItem.title} />
            <div className="pixel-preview-info">
              <h3>{previewItem.title}</h3>
              {previewItem.description && <p>{previewItem.description}</p>}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
