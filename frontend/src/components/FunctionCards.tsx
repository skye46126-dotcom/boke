/**
 * FunctionCards 组件
 * 功能卡片系统：CSS Grid 均衡布局
 * 磁吸效果：仅小尺寸卡牌使用，大卡片排除
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useMagnetic } from '@/lib/hooks/useMagnetic';

interface FunctionCardsProps {
  onDrawCardClick: () => void;
  isCollapsed?: boolean;
  className?: string;
}

// 磁吸小卡牌 - Link
function MagneticSmallCard({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  const magneticRef = useMagnetic({ strength: 0.3, radius: 80 });
  return (
    <Link ref={magneticRef as React.RefObject<HTMLAnchorElement>} href={href} className={`${className} magnetic-small-card`}>
      {children}
    </Link>
  );
}

// 磁吸小卡牌 - 外部链接
function MagneticExternalCard({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  const magneticRef = useMagnetic({ strength: 0.3, radius: 80 });
  return (
    <a ref={magneticRef as React.RefObject<HTMLAnchorElement>} href={href} target="_blank" rel="noopener noreferrer" className={`${className} magnetic-small-card`}>
      {children}
    </a>
  );
}

// 磁吸小卡牌 - 可点击Div
function MagneticClickableCard({ className, onClick, children }: { className: string; onClick: () => void; children: React.ReactNode }) {
  const magneticRef = useMagnetic({ strength: 0.3, radius: 80 });
  return (
    <div ref={magneticRef as React.RefObject<HTMLDivElement>} className={`${className} magnetic-small-card`} onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onClick()}>
      {children}
    </div>
  );
}

export default function FunctionCards({ onDrawCardClick, isCollapsed = false, className = '' }: FunctionCardsProps) {
  return (
    <div className={`function-cards-grid ${isCollapsed ? 'cards-collapsed' : ''} ${className}`}>
      {/* 大卡片 - 无磁吸 */}
      <div className="poker-card card-about no-magnetic">
        <div className="poker-card-content">
          <div className="poker-card-suit"><span className="pixel-icon">👤</span></div>
          <h3 className="card-title pixel-font">关于我</h3>
          <p className="card-description">一个热爱像素艺术和代码的开发者，正在构建属于自己的数字世界。</p>
          <Link href="#about" className="card-link pixel-button">了解更多</Link>
        </div>
      </div>

      <div className="poker-card card-skills no-magnetic">
        <div className="poker-card-content">
          <div className="poker-card-suit"><span className="pixel-icon">⚡</span></div>
          <h3 className="card-title pixel-font">技能</h3>
          <div className="skills-list">
            <span className="skill-tag">React</span>
            <span className="skill-tag">TypeScript</span>
            <span className="skill-tag">Node.js</span>
          </div>
        </div>
      </div>

      <div className="poker-card card-article no-magnetic">
        <div className="poker-card-content">
          <div className="poker-card-suit"><span className="pixel-icon">📖</span></div>
          <h3 className="card-title pixel-font">最新文章</h3>
          <p className="article-excerpt">查看博客获取最新内容...</p>
          <Link href="/articles" className="card-link pixel-button">查看所有文章</Link>
        </div>
      </div>

      <div className="poker-card card-projects no-magnetic">
        <div className="poker-card-content">
          <div className="poker-card-suit"><span className="pixel-icon">⚙️</span></div>
          <h3 className="card-title pixel-font">作品集</h3>
          <p className="projects-placeholder">项目开发中...</p>
          <Link href="#projects" className="card-link pixel-button">查看所有项目</Link>
        </div>
      </div>

      <div className="poker-card card-contact no-magnetic">
        <div className="poker-card-content">
          <div className="poker-card-suit"><span className="pixel-icon">📧</span></div>
          <h3 className="card-title pixel-font">联系</h3>
          <div className="contact-links">
            <a href="mailto:contact@example.com" className="contact-link"><span className="pixel-icon">✉️</span></a>
            <a href="https://github.com" className="contact-link"><span className="pixel-icon">🔗</span></a>
          </div>
        </div>
      </div>

      {/* 小卡牌 - 使用磁吸 */}
      <MagneticClickableCard className="poker-card card-draw" onClick={onDrawCardClick}>
        <div className="poker-card-content">
          <div className="card-back-pattern"><div className="pattern-grid"></div></div>
          <div className="draw-card-label"><span className="pixel-font">抽卡</span></div>
        </div>
      </MagneticClickableCard>

      <MagneticSmallCard href="/articles" className="poker-card card-blog">
        <div className="poker-card-content card-icon-center">
          <span className="pixel-icon">📝</span>
          <h3 className="card-title pixel-font">博客</h3>
        </div>
      </MagneticSmallCard>

      <MagneticExternalCard href="https://github.com" className="poker-card card-github">
        <div className="poker-card-content card-icon-center">
          <span className="pixel-icon">🐙</span>
          <h3 className="card-title pixel-font">GitHub</h3>
        </div>
      </MagneticExternalCard>

      <MagneticSmallCard href="/timeline" className="poker-card card-timeline">
        <div className="poker-card-content card-icon-center">
          <span className="pixel-icon">📅</span>
          <h3 className="card-title pixel-font">时间线</h3>
        </div>
      </MagneticSmallCard>

      <MagneticSmallCard href="/friends" className="poker-card card-friends">
        <div className="poker-card-content card-icon-center">
          <span className="pixel-icon">🔗</span>
          <h3 className="card-title pixel-font">友链</h3>
        </div>
      </MagneticSmallCard>

      <MagneticSmallCard href="/music" className="poker-card card-music">
        <div className="poker-card-content card-icon-center">
          <span className="pixel-icon">🎵</span>
          <h3 className="card-title pixel-font">音乐</h3>
        </div>
      </MagneticSmallCard>

      <MagneticSmallCard href="/gallery" className="poker-card card-gallery">
        <div className="poker-card-content card-icon-center">
          <span className="pixel-icon">🖼️</span>
          <h3 className="card-title pixel-font">相册</h3>
        </div>
      </MagneticSmallCard>
    </div>
  );
}
