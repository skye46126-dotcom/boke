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

  // 使用 IntersectionObserver 监听标题，高亮当前标题
  useEffect(() => {
    if (items.length === 0) return;

    const headingElements = items
      .map(item => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 找到所有可见的标题
        const visibleEntries = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => {
            return a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top;
          });

        // 高亮最顶部的可见标题
        if (visibleEntries.length > 0) {
          const topEntry = visibleEntries[0];
          setActiveId(topEntry.target.id);
        }
      },
      {
        rootMargin: '0px 0px -70% 0px', // 当标题在视口顶部 30% 时激活
        threshold: 0,
      }
    );

    headingElements.forEach(element => observer.observe(element));

    return () => {
      headingElements.forEach(element => observer.unobserve(element));
    };
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
          {items.map((item, index) => (
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
                <span className="toc-item-number">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="toc-item-text">{item.text}</span>
              </MagneticLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}