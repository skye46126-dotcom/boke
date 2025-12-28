'use client';

/**
 * GalleryClient - 相册客户端组件（像素风格）
 * 
 * 核心功能：
 * 1. 【视图切换】- 图片平铺 / 图片集分组
 * 2. 【分类筛选】- 像素风格按钮
 * 3. 【响应式网格】- 像素卡片布局
 * 4. 【图片预览】- 像素风格弹窗
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { GalleryItem, GalleryAlbum, GalleryViewMode } from '@/types/gallery';
import '@/styles/gallery-pixel.css';

const API_URL = 'http://localhost:3001';

// ========================================
// API 请求函数
// ========================================

async function fetchGallery(category?: string): Promise<GalleryItem[]> {
  const url = category && category !== 'all'
    ? `${API_URL}/api/gallery?category=${encodeURIComponent(category)}`
    : `${API_URL}/api/gallery`;
  const res = await fetch(url);
  const data = await res.json();
  return data.success ? data.data.items : [];
}

async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${API_URL}/api/gallery/categories`);
  const data = await res.json();
  return data.success ? data.data : [];
}

async function fetchAlbums(): Promise<GalleryAlbum[]> {
  const res = await fetch(`${API_URL}/api/gallery/albums`);
  const data = await res.json();
  return data.success ? data.data : [];
}

// ========================================
// 像素风格图标
// ========================================

const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <rect x="1" y="1" width="6" height="6" />
    <rect x="9" y="1" width="6" height="6" />
    <rect x="1" y="9" width="6" height="6" />
    <rect x="9" y="9" width="6" height="6" />
  </svg>
);

const AlbumIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <rect x="2" y="4" width="12" height="10" />
    <rect x="4" y="2" width="8" height="2" />
  </svg>
);

// ========================================
// 主组件
// ========================================

export default function GalleryClient() {
  const [viewMode, setViewMode] = useState<GalleryViewMode>('grid');
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);

  // 加载分类
  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
  }, []);

  // 加载数据
  useEffect(() => {
    setLoading(true);
    
    // 始终加载相册集列表（用于显示名称）
    fetchAlbums().then(setAlbums).catch(console.error);
    
    if (viewMode === 'grid') {
      fetchGallery(activeCategory)
        .then(setItems)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      fetchAlbums()
        .then(setAlbums)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [viewMode, activeCategory]);

  // 获取相册集名称
  const getAlbumName = (albumId: string | null) => {
    if (!albumId) return null;
    const album = albums.find(a => a.id === albumId);
    return album ? album.name : null;
  };

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

  // 加载状态
  if (loading) {
    return (
      <div className="pixel-loading">
        <div className="pixel-loading-spinner" />
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <>
      {/* 视图切换 - 像素按钮 */}
      <div className="pixel-view-toggle">
        <button
          className={`pixel-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
          onClick={() => setViewMode('grid')}
        >
          <GridIcon />
          <span>平铺</span>
        </button>
        <button
          className={`pixel-toggle-btn ${viewMode === 'albums' ? 'active' : ''}`}
          onClick={() => setViewMode('albums')}
        >
          <AlbumIcon />
          <span>图片集</span>
        </button>
      </div>

      {/* 分类筛选 - 仅平铺视图 */}
      {viewMode === 'grid' && categories.length > 0 && (
        <div className="pixel-category-filter">
          <button
            className={`pixel-filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            全部
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`pixel-filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* 内容区域 */}
      {viewMode === 'grid' ? (
        // 图片平铺网格 - 纯净模式
        items.length > 0 ? (
          <div className="pixel-gallery-grid">
            {items.map((item) => (
              <div
                key={item.id}
                className="pixel-gallery-item"
                onClick={() => setPreviewItem(item)}
              >
                <img
                  src={item.img_url}
                  alt={item.title}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="pixel-empty-state">暂无作品</div>
        )
      ) : (
        // 图片集网格
        albums.length > 0 ? (
          <div className="pixel-albums-grid">
            {albums.map((album) => (
              <Link
                key={album.id}
                href={`/gallery/album/${album.id}`}
                className="pixel-album-card"
              >
                <div className="pixel-album-cover">
                  {album.cover_url ? (
                    <img src={album.cover_url} alt={album.name} loading="lazy" />
                  ) : (
                    <div className="no-cover">📷</div>
                  )}
                  <span className="pixel-album-count">{album.image_count} 张</span>
                </div>
                <div className="pixel-album-info">
                  <h3>{album.name}</h3>
                  {album.description && <p>{album.description}</p>}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="pixel-empty-state">暂无图片集</div>
        )
      )}

      {/* 图片预览弹窗 - 纯净模式 */}
      {previewItem && (
        <div className="pixel-preview-overlay" onClick={handleClosePreview}>
          <button className="pixel-preview-close" onClick={handleClosePreview}>
            ×
          </button>
          <div className="pixel-preview-content" onClick={(e) => e.stopPropagation()}>
            <img src={previewItem.img_url} alt={previewItem.title} />
          </div>
        </div>
      )}
    </>
  );
}
