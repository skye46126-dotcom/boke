/**
 * ArticleLayout 组件
 * 响应式文章布局，支持精确的响应式断点和测量
 * PC (≥1200px): 侧边栏 240px 固定，内容 80% 最大 1200px
 * Tablet (768-1199px): 侧边栏 200px 固定，内容 85% 最大 900px  
 * Mobile (≤767px): 侧边栏折叠为 40px 图标，内容 100%
 */

'use client';

import React, { useState, useEffect } from 'react';
import { TocItem } from '@/types/rich-article';
import TableOfContents from './TableOfContents';
import SignatureIcon from './SignatureIcon';
import MagneticLink from './MagneticLink';
import ThemeToggle from './ThemeToggle';

interface ArticleLayoutProps {
  tableOfContents?: TocItem[];
  showToc?: boolean;
  article: React.ReactNode;
}

export default function ArticleLayout({
  tableOfContents = [],
  showToc = true,
  article,
}: ArticleLayoutProps) {
  const hasToc = showToc && tableOfContents.length > 0;
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // 检测屏幕尺寸
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width <= 767) {
        setScreenSize('mobile');
      } else if (width <= 1199) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // 移动端自动关闭侧边栏
  useEffect(() => {
    if (screenSize === 'mobile') {
      setSidebarVisible(false);
    }
  }, [screenSize]);

  return (
    <>
      {/* 固定侧边栏 - 独立于页面布局 */}
      {hasToc && (
        <aside 
          className={`article-sidebar ${sidebarVisible ? 'visible' : ''}`}
          style={{
            // 移动端使用 translateX 来隐藏/显示，但保持 fixed 定位
            transform: screenSize === 'mobile' && !sidebarVisible 
              ? 'translate3d(-100%, 0, 0)' 
              : 'translate3d(0, 0, 0)',
            width: screenSize === 'mobile' ? (sidebarVisible ? '280px' : '40px') :
                   screenSize === 'tablet' ? '200px' : '240px',
          }}
        >
          {/* 移动端图标导航 */}
          {screenSize === 'mobile' && !sidebarVisible && (
            <div className="sidebar-header">
              <button
                onClick={() => setSidebarVisible(true)}
                className="pixel-icon-button"
                style={{
                  width: '32px',
                  height: '32px',
                  margin: '8px auto',
                  display: 'block',
                }}
                title="展开目录"
                aria-label="展开目录"
              >
                📋
              </button>
              <div style={{ padding: '0 8px' }}>
                <ThemeToggle variant="icon" size="sm" />
              </div>
            </div>
          )}

          {/* 完整侧边栏内容 */}
          {(screenSize !== 'mobile' || sidebarVisible) && (
            <div className="sidebar-scroll-container">
              {/* 导航区域 */}
              <div className="sidebar-header">
                <MagneticLink 
                  href="/" 
                  className="back-link"
                  config={{ strength: 0.2, radius: 80 }}
                >
                  ← 返回首页
                </MagneticLink>
              </div>

              {/* 目录区域 */}
              <div style={{ padding: screenSize === 'desktop' ? '16px' : '12px' }}>
                <TableOfContents items={tableOfContents} />
              </div>

              {/* 页脚工具 */}
              <div className="sidebar-footer">
                {/* 主题设置 - 像素风格微缩卡片 */}
                <div className="pixel-mini-card">
                  <h4>主题设置</h4>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <ThemeToggle variant="segmented" size="sm" />
                  </div>
                </div>

                {/* 分享工具 - 像素风格微缩卡片 */}
                <div className="pixel-mini-card">
                  <h4>分享文章</h4>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-start' }}>
                    <button
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
                      className="pixel-icon-button"
                      style={{
                        width: '32px',
                        height: '32px',
                        background: 'var(--color-pixel-card-bg)',
                        border: '1px solid var(--color-pixel-border)',
                        borderRadius: '0',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                        fontFamily: 'monospace',
                        boxShadow: '1px 0 0 var(--color-pixel-shadow), 0 1px 0 var(--color-pixel-shadow), 1px 1px 0 var(--color-pixel-shadow)',
                      }}
                      title="分享文章"
                    >
                      🔗
                    </button>
                    <button
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="pixel-icon-button"
                      style={{
                        width: '32px',
                        height: '32px',
                        background: 'var(--color-pixel-card-bg)',
                        border: '1px solid var(--color-pixel-border)',
                        borderRadius: '0',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        transition: 'all 0.2s ease',
                        fontFamily: 'monospace',
                        boxShadow: '1px 0 0 var(--color-pixel-shadow), 0 1px 0 var(--color-pixel-shadow), 1px 1px 0 var(--color-pixel-shadow)',
                      }}
                      title="回到顶部"
                    >
                      ⬆️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </aside>
      )}

      {/* 遮罩层 - 仅移动端 */}
      {screenSize === 'mobile' && sidebarVisible && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 9998, /* 在侧边栏下方，但在内容上方 */
          }}
          onClick={() => setSidebarVisible(false)}
        />
      )}

      {/* 页面布局容器 */}
      <div className="article-layout" data-screen-size={screenSize}>
        {/* 主要内容区域 */}
        <main className="article-main">
          <div 
            style={{
              width: screenSize === 'mobile' ? '100%' :
                     screenSize === 'tablet' ? '85%' : '80%',
              maxWidth: screenSize === 'mobile' ? 'none' :
                       screenSize === 'tablet' ? '900px' : '1200px',
              margin: '0 auto',
              padding: screenSize === 'mobile' ? '16px' :
                       screenSize === 'tablet' ? '24px' : '32px',
            }}
          >
            {article}
          </div>
        </main>
        
        {/* 页脚签名图标 */}
        <footer className="article-footer">
          <SignatureIcon />
        </footer>
      </div>
    </>
  );
}