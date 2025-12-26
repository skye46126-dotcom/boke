/**
 * RichMarkdownContent 组件
 * 渲染预处理的富文本内容，集成标题揭示动画和磁吸链接
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { TocItem } from '@/types/rich-article';
import { HeadingReveal } from '@/lib/interactions/heading-reveal';
import { MagneticElement } from '@/lib/interactions/magnetic';

interface RichMarkdownContentProps {
  htmlContent: string;
  tableOfContents?: TocItem[]; // 可选，后续用于目录组件
}

export default function RichMarkdownContent({
  htmlContent,
}: RichMarkdownContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HeadingReveal | null>(null);
  const magneticInstancesRef = useRef<MagneticElement[]>([]);

  useEffect(() => {
    if (!contentRef.current) return;

    console.log('[RichMarkdownContent] Initializing heading reveal and magnetic effects');

    // 初始化标题揭示动画
    revealRef.current = new HeadingReveal({
      animationType: 'mask-reveal',
      duration: 250,
      threshold: 0.5,
    });

    // 查找所有标题并应用揭示效果
    const headings = Array.from(
      contentRef.current.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')
    );

    console.log(`[RichMarkdownContent] Found ${headings.length} headings`);

    if (headings.length > 0) {
      revealRef.current.observe(headings);
    }

    // 为内容中的链接添加磁吸效果
    const links = Array.from(
      contentRef.current.querySelectorAll<HTMLElement>('a')
    );

    console.log(`[RichMarkdownContent] Found ${links.length} links for magnetic effect`);

    links.forEach((link) => {
      const magneticInstance = new MagneticElement(link, {
        strength: 0.15,
        radius: 60,
        easing: 'elastic',
        duration: 200,
      });
      magneticInstancesRef.current.push(magneticInstance);
    });

    // 处理图片懒加载
    const images = Array.from(
      contentRef.current.querySelectorAll<HTMLImageElement>('img')
    );

    images.forEach((img) => {
      // 检查是否有破格布局类
      const isBreakout = img.classList.contains('breakout') || 
                        img.parentElement?.classList.contains('breakout');
      
      // 创建 LazyImage 组件的容器
      const container = document.createElement('div');
      container.className = 'lazy-image-wrapper';
      
      // 替换原始图片
      img.parentNode?.insertBefore(container, img);
      img.remove();
      
      // 这里我们需要使用 React 的方式来渲染 LazyImage
      // 但由于我们在 useEffect 中，我们需要另一种方法
      // 暂时保持原始图片，但添加懒加载属性
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt;
      newImg.className = `lazy-image ${isBreakout ? 'breakout' : ''}`;
      newImg.loading = 'lazy';
      newImg.style.transition = 'opacity 0.3s ease';
      
      container.appendChild(newImg);
    });

    // 清理函数
    return () => {
      if (revealRef.current) {
        revealRef.current.destroy();
        revealRef.current = null;
      }

      // 清理磁吸实例
      magneticInstancesRef.current.forEach((instance) => instance.destroy());
      magneticInstancesRef.current = [];
    };
  }, [htmlContent]);

  return (
    <div 
      ref={contentRef}
      className="markdown-content rich-content"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
