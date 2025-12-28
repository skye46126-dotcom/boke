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

// 长廊图片类型
interface CorridorImage {
  id: string;
  title: string;
  description?: string;
  img_url: string;
  author?: string;
  date?: string;
  order?: number;
}

// ========================================
// 主组件
// ========================================

interface GalleryShowcaseProps {
  images: CorridorImage[];
}

export default function GalleryShowcase({ images }: GalleryShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // 触摸滑动状态
  const touchStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

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
    if (isTransitioning || currentIndex >= images.length - 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [currentIndex, images.length, isTransitioning]);

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

  // 空状态
  if (images.length === 0) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--vintage-bg, #F5F0E8)',
          fontFamily: "'Noto Serif SC', Georgia, serif",
        }}
      >
        <p style={{ color: 'var(--vintage-text-light, #8B7355)', marginBottom: '16px', fontSize: '18px' }}>
          📜 暂无作品
        </p>
        <p style={{ color: 'var(--vintage-text-light, #8B7355)', marginBottom: '24px', fontSize: '14px' }}>
          请在后台管理的"长廊管理"中添加图片
        </p>
        <Link
          href="/gallery"
          style={{
            color: 'var(--vintage-accent, #9E7F66)',
            textDecoration: 'none',
            padding: '10px 20px',
            border: '1px solid var(--vintage-border, #D4C7B0)',
            borderRadius: '4px',
            background: 'var(--vintage-paper, #FAF7F2)',
          }}
        >
          返回相册
        </Link>
      </div>
    );
  }

  const currentItem = images[currentIndex];

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--vintage-bg, #F5F0E8)',
        position: 'relative',
        touchAction: 'none',
        fontFamily: "'Noto Serif SC', Georgia, serif",
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
          background: 'var(--vintage-paper, #FAF7F2)',
          border: '1px solid var(--vintage-border, #D4C7B0)',
          borderRadius: '4px',
          color: 'var(--vintage-text-dark, #4A3F35)',
          textDecoration: 'none',
          fontWeight: 500,
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 8px rgba(74, 63, 53, 0.1)',
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
            maxHeight: '70vh',
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
              boxShadow: '0 8px 32px rgba(74, 63, 53, 0.2)',
              borderRadius: '4px',
              border: '4px solid var(--vintage-paper, #FAF7F2)',
            }}
          />

          {/* 作品信息 */}
          <div
            style={{
              marginTop: '24px',
              textAlign: 'center',
              background: 'var(--vintage-paper, #FAF7F2)',
              padding: '16px 24px',
              borderRadius: '4px',
              border: '1px solid var(--vintage-border, #D4C7B0)',
              boxShadow: '0 2px 8px rgba(74, 63, 53, 0.08)',
            }}
          >
            <h2
              style={{
                fontSize: '22px',
                fontWeight: 600,
                color: 'var(--vintage-text-dark, #4A3F35)',
                marginBottom: '8px',
                margin: 0,
              }}
            >
              {currentItem.title}
            </h2>
            {currentItem.author && (
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--vintage-accent, #9E7F66)',
                  margin: '8px 0 0 0',
                }}
              >
                作者: {currentItem.author}
              </p>
            )}
            {currentItem.date && (
              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--vintage-text-light, #8B7355)',
                  margin: '4px 0 0 0',
                }}
              >
                {currentItem.date}
              </p>
            )}
            {currentItem.description && (
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--vintage-text-medium, #6B5D4D)',
                  maxWidth: '600px',
                  margin: '12px 0 0 0',
                  lineHeight: 1.6,
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
        {images.map((_, index) => (
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
                ? 'var(--vintage-accent, #9E7F66)' 
                : 'var(--vintage-border, #D4C7B0)',
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
          color: 'var(--vintage-text-light, #8B7355)',
          fontSize: '14px',
          zIndex: 100,
          background: 'var(--vintage-paper, #FAF7F2)',
          padding: '8px 16px',
          borderRadius: '4px',
          border: '1px solid var(--vintage-border, #D4C7B0)',
        }}
      >
        {currentIndex + 1} / {images.length}
      </div>

      {/* ========================================
       * 滑动提示（首次显示）
       * ======================================== */}
      {currentIndex === 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: '70px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'var(--vintage-text-light, #8B7355)',
            fontSize: '12px',
            opacity: 0.7,
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
