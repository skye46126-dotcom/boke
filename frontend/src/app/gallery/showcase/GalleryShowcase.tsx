'use client';

/**
 * GalleryShowcase - 画廊长廊组件
 * 
 * 核心功能：
 * 1. 【垂直长廊布局】- 全屏纵向，单幅作品居中展示
 * 2. 【滑动切换】- 滚轮/触屏上下滑动切换作品
 * 3. 【返回导航】- 左上角返回相册按钮
 * 4. 【响应式适配】- PC/移动端自适应
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { GalleryItem } from '@/types/gallery';

const API_URL = 'http://localhost:3001';

// ========================================
// 数据获取
// ========================================

async function fetchGalleryItems(): Promise<GalleryItem[]> {
  // 从长廊配置 API 获取图片（按 showcase_order 排序）
  const res = await fetch(`${API_URL}/api/gallery/showcase`);
  const data = await res.json();
  return data.success ? data.data : [];
}

// ========================================
// 主组件
// ========================================

export default function GalleryShowcase() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // 触摸滑动状态
  const touchStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 加载数据
  useEffect(() => {
    fetchGalleryItems()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ========================================
  // 【滑动切换】核心逻辑
  // ========================================

  // 切换到上一幅
  const goToPrev = useCallback(() => {
    if (isTransitioning || currentIndex <= 0) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [currentIndex, isTransitioning]);

  // 切换到下一幅
  const goToNext = useCallback(() => {
    if (isTransitioning || currentIndex >= items.length - 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [currentIndex, items.length, isTransitioning]);

  // 【PC端】滚轮事件
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        goToNext();
      } else if (e.deltaY < 0) {
        goToPrev();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [goToNext, goToPrev]);

  // 【移动端】触摸事件
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;
    const threshold = 50; // 滑动阈值

    if (deltaY > threshold) {
      goToNext(); // 向上滑动 -> 下一幅
    } else if (deltaY < -threshold) {
      goToPrev(); // 向下滑动 -> 上一幅
    }
  }, [goToNext, goToPrev]);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        goToPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  // ========================================
  // 渲染
  // ========================================

  // 加载状态
  if (loading) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-background)',
        }}
      >
        <p style={{ color: 'var(--color-text-secondary)' }}>加载中...</p>
      </div>
    );
  }

  // 空状态
  if (items.length === 0) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-background)',
        }}
      >
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px' }}>暂无作品</p>
        <Link
          href="/gallery"
          style={{
            color: 'var(--color-accent)',
            textDecoration: 'none',
          }}
        >
          返回相册
        </Link>
      </div>
    );
  }

  const currentItem = items[currentIndex];

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--color-background)',
        position: 'relative',
        touchAction: 'none', // 禁用默认触摸行为
      }}
    >
      {/* ========================================
       * 【返回导航】左上角返回按钮
       * ======================================== */}
      <Link
        href="/gallery"
        style={{
          position: 'fixed',
          top: '24px',
          left: '24px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 20px',
          background: 'var(--color-surface-raised)',
          border: '2px solid var(--color-border)',
          color: 'var(--color-text-primary)',
          textDecoration: 'none',
          fontWeight: 500,
          transition: 'all 0.2s ease',
        }}
      >
        <span>←</span>
        <span>返回相册</span>
      </Link>

      {/* ========================================
       * 【垂直长廊布局】作品展示区
       * ======================================== */}
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          boxSizing: 'border-box',
        }}
      >
        {/* 作品容器 - 带位移动画 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '90vw',
            maxHeight: '70vh', // 占屏幕高度70%
            transition: 'transform 0.5s ease, opacity 0.5s ease',
            transform: isTransitioning ? 'translateY(20px)' : 'translateY(0)',
            opacity: isTransitioning ? 0.8 : 1,
          }}
        >
          {/* 作品图片 */}
          <img
            src={currentItem.img_url}
            alt={currentItem.title}
            style={{
              maxWidth: '100%',
              maxHeight: '60vh',
              objectFit: 'contain',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            }}
          />

          {/* 作品信息 */}
          <div
            style={{
              marginTop: '24px',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 600,
                color: 'var(--color-text-primary)',
                marginBottom: '8px',
              }}
            >
              {currentItem.title}
            </h2>
            {currentItem.description && (
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--color-text-secondary)',
                  maxWidth: '600px',
                }}
              >
                {currentItem.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ========================================
       * 进度指示器
       * ======================================== */}
      <div
        style={{
          position: 'fixed',
          right: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 100,
        }}
      >
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isTransitioning) {
                setIsTransitioning(true);
                setCurrentIndex(index);
                setTimeout(() => setIsTransitioning(false), 500);
              }
            }}
            style={{
              width: '8px',
              height: index === currentIndex ? '24px' : '8px',
              borderRadius: '4px',
              border: 'none',
              background: index === currentIndex 
                ? 'var(--color-accent)' 
                : 'var(--color-border)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
            aria-label={`跳转到第 ${index + 1} 幅作品`}
          />
        ))}
      </div>

      {/* ========================================
       * 底部计数器
       * ======================================== */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'var(--color-text-muted)',
          fontSize: '14px',
          zIndex: 100,
        }}
      >
        {currentIndex + 1} / {items.length}
      </div>

      {/* ========================================
       * 滑动提示（首次显示）
       * ======================================== */}
      {currentIndex === 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'var(--color-text-muted)',
            fontSize: '12px',
            opacity: 0.6,
            animation: 'bounce 2s infinite',
          }}
        >
          ↓ 滑动浏览更多
        </div>
      )}

      {/* 动画样式 */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </div>
  );
}
