/**
 * TableOfContents 组件
 * 响应式目录组件，支持桌面端侧边栏和移动端折叠
 */

'use client';

import React, { useState, useEffect } from 'react';
import { TocItem } from '@/types/rich-article';
import MagneticLink from './MagneticLink';

interface TableOfContentsProps {
  items: TocItem[];
  className?: string;
}

export default function TableOfContents({
  items,
  className = '',
}: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);

  // 检测屏幕尺寸
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 监听滚动，高亮当前标题
  useEffect(() => {
    const handleScroll = () => {
      const headings = items.map(item => document.getElementById(item.id)).filter(Boolean);
      
      if (headings.length === 0) return;

      // 找到当前视口中的标题
      let currentId = '';
      const scrollY = window.scrollY + 100; // 偏移量

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        if (heading && heading.offsetTop <= scrollY) {
          currentId = heading.id;
          break;
        }
      }

      setActiveId(currentId);
    };

    handleScroll(); // 初始调用
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  // 平滑滚动到目标标题
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 80; // 留出顶部空间
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
    
    // 移动端点击后关闭目录
    if (isMobile) {
      setIsOpen(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  const tocClasses = [
    'table-of-contents',
    isMobile ? 'mobile' : 'desktop',
    isOpen ? 'open' : 'closed',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav className={tocClasses} aria-label="文章目录">
      {isMobile && (
        <button
          className="toc-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="toc-list"
        >
          <span className="toc-toggle-icon">
            {isOpen ? '▲' : '▼'}
          </span>
          <span className="toc-toggle-text">目录</span>
          <span className="toc-count">({items.length})</span>
        </button>
      )}

      <div className="toc-content" id="toc-list">
        {!isMobile && (
          <h3 className="toc-title">目录</h3>
        )}
        
        <ul className="toc-list">
          {items.map((item) => (
            <li
              key={item.id}
              className={`toc-item level-${item.level} ${
                activeId === item.id ? 'active' : ''
              }`}
            >
              <MagneticLink
                href={`#${item.id}`}
                className="toc-link"
                config={{ strength: 0.1, radius: 40 }}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToHeading(item.id);
                }}
              >
                <span className="toc-text">{item.text}</span>
              </MagneticLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}