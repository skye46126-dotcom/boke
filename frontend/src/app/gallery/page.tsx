/**
 * Gallery Page - 相册页面（像素风格）
 */

import type { Metadata } from 'next';
import GalleryClient from './GalleryClient';
import FixedThemeToggle from '@/components/FixedThemeToggle';
import { getAlbums, getGalleryItems, getCategories } from '@/content/gallery';
import '@/styles/gallery-pixel.css';

export const metadata: Metadata = {
  title: '相册 - 像素开发者',
  description: '浏览像素风格作品集',
};

export default function GalleryPage() {
  // 在服务端获取数据
  const albums = getAlbums();
  const items = getGalleryItems();
  const categories = getCategories();

  return (
    <main className="gallery-page" style={{ position: 'relative' }}>
      {/* 右上角主题切换 */}
      <FixedThemeToggle />

      {/* 页面头部 - 像素风格 */}
      <header className="gallery-page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>📷 相册</h1>
          {/* 长廊模式入口 - 像素按钮 */}
          <a
            href="/gallery/showcase"
            className="pixel-toggle-btn"
            style={{ textDecoration: 'none' }}
          >
            <span>🖼️</span>
            <span>长廊模式</span>
          </a>
        </div>
      </header>
      
      {/* 相册内容 - 传递静态数据 */}
      <GalleryClient 
        initialAlbums={albums}
        initialItems={items}
        initialCategories={categories}
      />
    </main>
  );
}
