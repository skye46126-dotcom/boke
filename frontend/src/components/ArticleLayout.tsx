/**
 * ArticleLayout 组件
 * 响应式文章布局，支持桌面端侧边栏和移动端折叠
 */

'use client';

import React from 'react';
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

  return (
    <div className="article-layout">
      <div className="article-layout-container">
        {/* 移动端目录 */}
        {hasToc && (
          <div className="mobile-toc-container">
            <TableOfContents items={tableOfContents} />
          </div>
        )}

        <div className="article-layout-content">
          {/* 主要内容区域 */}
          <div className="article-main">
            {children}
          </div>

          {/* 桌面端侧边栏 */}
          {hasToc && (
            <aside className="article-sidebar">
              <div className="sidebar-content">
                <TableOfContents items={tableOfContents} />
                
                {/* 分享工具 */}
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
          )}
        </div>
      </div>
      
      {/* 页脚签名图标 */}
      <footer className="article-footer">
        <SignatureIcon />
      </footer>
    </div>
  );
}