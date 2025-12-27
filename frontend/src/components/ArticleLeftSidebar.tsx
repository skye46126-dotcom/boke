/**
 * ArticleLeftSidebar 组件
 * 像素风左侧侧边栏：返回按钮、目录、日夜模式切换
 * 交互：hover左侧20px触发区展开，离开收起，移动端点击触发
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TocItem } from '@/types/rich-article';
// import ThemeToggle from './ThemeToggle';
import '@/styles/article-left-sidebar.css';

interface ArticleLeftSidebarProps {
  tableOfContents?: TocItem[];
  backUrl?: string;
  backText?: string;
}

export default function ArticleLeftSidebar({
  tableOfContents = [],
  backUrl = '/',
  backText = '返回',
}: ArticleLeftSidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeId, setActiveId] = useState<string>('');
  const [currentTheme, setCurrentTheme] = useState<string>('light');

  // 检测屏幕尺寸
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 初始化主题状态
  useEffect(() => {
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    setCurrentTheme(theme);
  }, []);

  // 监听标题高亮
  useEffect(() => {
    if (tableOfContents.length === 0) return;

    const headingElements = tableOfContents
      .map(item => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top);

        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 }
    );

    headingElements.forEach(element => observer.observe(element));
    return () => headingElements.forEach(element => observer.unobserve(element));
  }, [tableOfContents]);

  // 滚动到目标标题
  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
    if (isMobile) setIsExpanded(false);
  }, [isMobile]);

  // 处理hover/点击
  const handleMouseEnter = () => {
    if (!isMobile) setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile) setIsExpanded(false);
  };

  const handleClick = () => {
    if (isMobile) setIsExpanded(!isExpanded);
  };

  // 切换主题
  const toggleTheme = () => {
    const html = document.documentElement;
    const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    setCurrentTheme(newTheme);
  };

  return (
    <>
      {/* 侧边栏容器 - 包含触发区和侧边栏主体 */}
      <div
        className="left-sidebar-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* 左侧触发区 - 20px宽度 */}
        <div
          className="left-sidebar-trigger"
          onClick={handleClick}
          aria-label="展开侧边栏"
        >
          <span className="trigger-indicator">›</span>
        </div>

        {/* 侧边栏主体 */}
        <aside
          className={`left-sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
        >
        <div className="left-sidebar-content">
          {/* 返回按钮 */}
          <a href={backUrl} className="left-sidebar-back">
            <span className="back-icon">←</span>
            <span className="back-text">{backText}</span>
          </a>

          {/* 目录 */}
          {tableOfContents.length > 0 && (
            <nav className="left-sidebar-toc" aria-label="文章目录">
              <h3 className="toc-title">目录</h3>
              <ul className="toc-list">
                {tableOfContents.map((item, index) => (
                  <li
                    key={item.id}
                    className={`toc-item level-${item.level} ${activeId === item.id ? 'active' : ''}`}
                  >
                    <a
                      href={`#${item.id}`}
                      className="toc-link"
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToHeading(item.id);
                      }}
                    >
                      <span className="toc-number">{String(index + 1).padStart(2, '0')}</span>
                      <span className="toc-text">{item.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* 日夜模式切换 */}
          <div className="left-sidebar-theme">
            <span className="theme-label">主题</span>
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              {currentTheme === 'dark' ? '☀️ 白天' : '🌙 黑夜'}
            </button>
          </div>
        </div>
      </aside>
      </div>

      {/* 移动端遮罩 */}
      {isMobile && isExpanded && (
        <div
          className="left-sidebar-overlay"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
}
