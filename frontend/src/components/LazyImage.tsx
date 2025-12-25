/**
 * LazyImage 组件
 * 支持懒加载、blurhash 占位符和响应式图片
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  blurhash?: string;
  breakout?: boolean; // 是否使用破格布局
  priority?: boolean; // 是否优先加载
  sizes?: string; // 响应式图片尺寸
}

export default function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  blurhash,
  breakout = false,
  priority = false,
  sizes,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // 使用 Intersection Observer 检测图片是否进入视口
  useEffect(() => {
    if (!imgRef.current || priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // 提前 50px 开始加载
        threshold: 0.1,
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  // 生成 blurhash 占位符的 data URL
  const generateBlurDataURL = (): string => {
    // 简化的 blurhash 占位符生成
    // 在实际项目中，你可能需要使用 blurhash 库
    return `data:image/svg+xml;base64,${btoa(
      `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999" font-family="Arial, sans-serif" font-size="14">
          Loading...
        </text>
      </svg>`
    )}`;
  };

  const imageClasses = [
    'lazy-image',
    breakout ? 'breakout' : '',
    isLoaded ? 'loaded' : 'loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={imgRef}
      className={`lazy-image-container ${breakout ? 'breakout-container' : ''}`}
    >
      {isInView && (
        <Image
          src={src}
          alt={alt}
          width={width || 800}
          height={height || 600}
          className={imageClasses}
          priority={priority}
          sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px'}
          placeholder={blurhash ? 'blur' : 'empty'}
          blurDataURL={blurhash ? generateBlurDataURL() : undefined}
          onLoad={() => setIsLoaded(true)}
          style={{
            objectFit: 'cover',
            transition: 'opacity 0.3s ease',
            opacity: isLoaded ? 1 : 0.8,
          }}
        />
      )}
      
      {!isInView && (
        <div className="image-placeholder">
          <div className="placeholder-content">
            <div className="placeholder-icon">📷</div>
            <div className="placeholder-text">Loading image...</div>
          </div>
        </div>
      )}
    </div>
  );
}