/**
 * Sidebar 组件
 * 侧边栏模块：个人信息、主题设置、标签云、阅读统计
 * 支持移动端收起/展开功能
 */

'use client';

import React, { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import PixelImage from './PixelImage';

interface Tag {
  id: string;
  name: string;
  count: number;
}

interface ReadingStats {
  totalArticles: number;
  totalViews: number;
}

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  isMobile?: boolean;
  className?: string;
}

export default function Sidebar({ 
  isOpen, 
  onClose, 
  isMobile = false,
  className = '' 
}: SidebarProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [stats, setStats] = useState<ReadingStats>({
    totalArticles: 0,
    totalViews: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // 静态博客：使用静态占位数据
  useEffect(() => {
    // 静态博客不再从后端获取标签，使用占位数据
    setTags([]);
    setStats({ totalArticles: 0, totalViews: 0 });
    setIsLoading(false);
  }, []);

  // 处理标签点击
  const handleTagClick = (tagName: string) => {
    // 跳转到文章列表页面，按标签筛选
    window.location.href = `/articles?tag=${encodeURIComponent(tagName)}`;
  };

  return (
    <>
      {/* 侧边栏主体 */}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''} ${className}`}>
        <div className="sidebar-content">
          {/* 个人信息卡 */}
          <div className="sidebar-module personal-info-card">
            <div className="avatar-small">
              <PixelImage 
                src="/images/avatar.svg" 
                alt="头像"
                className="avatar-image-small"
                width={80}
                height={80}
              />
            </div>
            <div className="personal-info">
              <h3 className="nickname pixel-font">像素开发者</h3>
              <p className="signature">构建数字世界的像素艺术家</p>
            </div>
          </div>

          {/* 主题设置模块 */}
          <div className="sidebar-module theme-settings">
            <h4 className="module-title pixel-font">主题设置</h4>
            <div className="theme-toggle-container">
              <ThemeToggle variant="segmented" size="sm" />
            </div>
          </div>

          {/* 文章标签云 */}
          <div className="sidebar-module tag-cloud">
            <h4 className="module-title pixel-font">文章标签</h4>
            <div className="tags-container">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <button
                    key={tag.id}
                    className="tag-item pixel-font"
                    onClick={() => handleTagClick(tag.name)}
                  >
                    {tag.name}
                    <span className="tag-count">({tag.count})</span>
                  </button>
                ))
              ) : (
                <div className="tags-placeholder">
                  <div className="tag-item pixel-font">前端开发</div>
                  <div className="tag-item pixel-font">像素设计</div>
                  <div className="tag-item pixel-font">作品集</div>
                </div>
              )}
            </div>
          </div>

          {/* 阅读统计 */}
          <div className="sidebar-module reading-stats">
            <h4 className="module-title pixel-font">阅读统计</h4>
            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-icon pixel-icon">📄</span>
                <div className="stat-info">
                  <span className="stat-value pixel-font">
                    {isLoading ? '--' : stats.totalArticles}
                  </span>
                  <span className="stat-label">总文章数</span>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon pixel-icon">👁️</span>
                <div className="stat-info">
                  <span className="stat-value pixel-font">
                    {isLoading ? '--' : stats.totalViews.toLocaleString()}
                  </span>
                  <span className="stat-label">总阅读量</span>
                </div>
              </div>
            </div>
          </div>

          {/* 快速链接 */}
          <div className="sidebar-module quick-links">
            <h4 className="module-title pixel-font">快速链接</h4>
            <div className="links-container">
              <a href="/articles" className="quick-link pixel-font">
                <span className="link-icon pixel-icon">📖</span>
                所有文章
              </a>
              <a href="/about" className="quick-link pixel-font">
                <span className="link-icon pixel-icon">👤</span>
                关于我
              </a>
              <a href="/contact" className="quick-link pixel-font">
                <span className="link-icon pixel-icon">📧</span>
                联系方式
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* 移动端遮罩 */}
      {isMobile && isOpen && onClose && (
        <div 
          className="sidebar-overlay"
          onClick={onClose}
          aria-label="关闭侧边栏"
        />
      )}
    </>
  );
}