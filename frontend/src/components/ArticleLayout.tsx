/**
 * ArticleLayout 组件
 * 响应式文章布局，支持桌面端侧边栏和移动端折叠
 * 侧边栏从左侧滑出，通过鼠标悬停触发
 */

'use client';

import React, { useState, useEffect } from 'react';
import { TocItem } from '@/types/rich-article';
import TableOfContents from './TableOfContents';
import SignatureIcon from './SignatureIcon';

interface ArticleLayoutProps {
  children: React.ReactNode;
  tableOfContents?: TocItem[];
  showToc?: boolean;
}

export default function ArticleLayout({
  children,
  tableOfContents = [],
  showToc = true,
}: ArticleLayoutProps) {
  const hasToc = showToc && tableOfContents.length > 0;
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // 检测是否为桌面端
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  return (
    <div className="article-layout">
      {/* 左侧触发热区 - 仅桌面端显示 */}
      {isDesktop && hasToc && (
        <div 
          className="sidebar-trigger-zone"
          onMouseEnter={() => setSidebarVisible(true)}
          aria-hidden="true"
        />
      )}

      <div className="article-layout-container">
        {/* 移动端目录 */}
        {!isDesktop && hasToc && (
          <div className="mobile-toc-container">
            <TableOfContents items={tableOfContents} />
          </div>
        )}

        <div className="article-layout-content">
          {/* 主要内容区域 */}
          <div className="article-main">
            {children}
          </div>
        </div>
      </div>

      {/* 桌面端滑出侧边栏 */}
      {isDesktop && hasToc && (
        <>
          {/* 遮罩层 */}
          {sidebarVisible && (
            <div 
              className="sidebar-overlay"
              onClick={() => setSidebarVisible(false)}
            />
          )}
          
          {/* 侧边栏 */}
          <aside 
            className={`article-sidebar-flyout ${sidebarVisible ? 'visible' : ''}`}
            onMouseLeave={() => setSidebarVisible(false)}
          >
            {/* 固定页首：目录标题 */}
            <div className="sidebar-header">
              <h3 className="sidebar-title">目录</h3>
            </div>

            {/* 可滚动内容区域：目录列表 */}
            <div className="sidebar-scrollable">
              <TableOfContents items={tableOfContents} />
            </div>

            {/* 固定页脚：分享工具 */}
            <div className="sidebar-footer">
              <div className="share-tools">
                <h4 className="share-title">分享文章</h4>
                <div className="share-buttons">
                  <button
                    className="share-button"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: document.title,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('链接已复制到剪贴板');
                      }
                    }}
                    title="分享文章"
                  >
                    🔗
                  </button>
                  <button
                    className="share-button"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    title="回到顶部"
                  >
                    ⬆️
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}
      
      {/* 页脚签名图标 */}
      <footer className="article-footer">
        <SignatureIcon />
      </footer>
    </div>
  );
}