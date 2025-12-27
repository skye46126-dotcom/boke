/**
 * PixelImage 组件
 * 支持懒加载的像素风格图片组件
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';

interface PixelImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  placeholder?: string;
  width?: number;
  height?: number;
}

export default function PixelImage({
  src,
  alt,
  className = '',
  fallback,
  placeholder,
  width,
  height
}: PixelImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // 懒加载观察器
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // 处理图片加载成功
  const handleLoad = () => {
    setIsLoaded(true);
    setIsError(false);
  };

  // 处理图片加载失败
  const handleError = () => {
    setIsError(true);
    setIsLoaded(false);
  };

  // 安全的 base64 编码函数
  const safeBase64Encode = (str: string) => {
    try {
      // 使用 encodeURIComponent 处理中文字符，然后转换为 base64
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      }));
    } catch (error) {
      // 如果 base64 编码失败，使用 URL 编码作为后备方案
      return encodeURIComponent(str);
    }
  };

  // 生成像素风格占位符
  const generatePixelPlaceholder = () => {
    const svgContent = `<svg width="${width || 200}" height="${height || 200}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#2c2c2c"/>
        <rect x="10%" y="10%" width="80%" height="80%" fill="#4a7a96"/>
        <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="#f5f2ef" font-family="monospace" font-size="12">Loading...</text>
      </svg>`;
    
    try {
      return `data:image/svg+xml;base64,${safeBase64Encode(svgContent)}`;
    } catch (error) {
      // 后备方案：使用 URL 编码
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
    }
  };

  // 生成错误占位符
  const generateErrorPlaceholder = () => {
    const svgContent = `<svg width="${width || 200}" height="${height || 200}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#2c2c2c"/>
        <rect x="10%" y="10%" width="80%" height="80%" fill="#8c6b48"/>
        <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="#f5f2ef" font-family="monospace" font-size="12">Error</text>
      </svg>`;
    
    try {
      return `data:image/svg+xml;base64,${safeBase64Encode(svgContent)}`;
    } catch (error) {
      // 后备方案：使用 URL 编码
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
    }
  };

  const currentSrc = isError 
    ? (fallback || generateErrorPlaceholder())
    : isInView 
      ? src 
      : (placeholder || generatePixelPlaceholder());

  return (
    <img
      ref={imgRef}
      src={currentSrc}
      alt={alt}
      className={`pixel-render ${className} ${isLoaded ? 'loaded' : 'loading'}`}
      onLoad={handleLoad}
      onError={handleError}
      width={width}
      height={height}
      style={{
        transition: 'opacity 0.3s ease',
        opacity: isLoaded || isError ? 1 : 0.7,
        imageRendering: 'pixelated',
        WebkitImageRendering: '-webkit-optimize-contrast',
        MozImageRendering: '-moz-crisp-edges',
      } as React.CSSProperties}
    />
  );
}