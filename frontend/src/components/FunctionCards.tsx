/**
 * FunctionCards 组件
 * 功能卡片系统：CSS Grid 均衡布局
 * 包含最新文章、抽卡机、作品集等功能卡片
 * 
 * 更新：使用 CSS Grid 替代绝对定位，确保卡片无重合、间距均匀
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  slug: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  image?: string;
  url?: string;
}

interface FunctionCardsProps {
  onDrawCardClick: () => void;
  isCollapsed?: boolean;
  className?: string;
}

export default function FunctionCards({ 
  onDrawCardClick, 
  isCollapsed = false,
  className = '' 
}: FunctionCardsProps) {
  const [latestArticle, setLatestArticle] = useState<Article | null>(null);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 获取最新文章数据
  useEffect(() => {
    async function fetchLatestArticle() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/stats`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.latestArticles.length > 0) {
            setLatestArticle(data.data.latestArticles[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch latest article:', error);
      }
    }

    fetchLatestArticle();
  }, []);

  // 获取精选项目数据
  useEffect(() => {
    async function fetchFeaturedProjects() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/projects?featured=true&limit=3`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setFeaturedProjects(data.data || []);
          }
        }
      } catch (error) {
        console.error('Failed to fetch featured projects:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeaturedProjects();
  }, []);

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`function-cards-grid ${isCollapsed ? 'cards-collapsed' : ''} ${className}`}>
      {/* 关于我 - 左上角 */}
      <div className="poker-card card-about">
        <div className="poker-card-content">
          <div className="poker-card-suit">
            <span className="pixel-icon">👤</span>
          </div>
          <h3 className="card-title pixel-font">关于我</h3>
          <p className="card-description">
            一个热爱像素艺术和代码的开发者，
            正在构建属于自己的数字世界。
          </p>
          <Link href="#about" className="card-link pixel-button">
            了解更多
          </Link>
        </div>
      </div>

      {/* 技能 - 左侧中间 */}
      <div className="poker-card card-skills">
        <div className="poker-card-content">
          <div className="poker-card-suit">
            <span className="pixel-icon">⚡</span>
          </div>
          <h3 className="card-title pixel-font">技能</h3>
          <div className="skills-list">
            <span className="skill-tag">React</span>
            <span className="skill-tag">TypeScript</span>
            <span className="skill-tag">Node.js</span>
          </div>
        </div>
      </div>

      {/* 抽卡机 - 右上角 */}
      <div 
        className="poker-card card-draw"
        onClick={onDrawCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onDrawCardClick()}
      >
        <div className="poker-card-content">
          <div className="card-back-pattern">
            <div className="pattern-grid"></div>
          </div>
          <div className="draw-card-label">
            <span className="pixel-font">抽卡</span>
          </div>
        </div>
      </div>

      {/* 最新文章 - 左下角 */}
      <div className="poker-card card-article">
        <div className="poker-card-content">
          <div className="poker-card-suit">
            <span className="pixel-icon">📖</span>
          </div>
          {latestArticle ? (
            <>
              <h3 className="card-title pixel-font">最新文章</h3>
              <h4 className="article-title">{latestArticle.title}</h4>
              <p className="article-excerpt">
                {latestArticle.excerpt || '暂无摘要...'}
              </p>
              <div className="article-meta">
                <span className="publish-date">
                  {formatDate(latestArticle.publishedAt)}
                </span>
              </div>
              <Link 
                href={`/articles/${latestArticle.slug}`} 
                className="card-link pixel-button"
              >
                阅读全文
              </Link>
            </>
          ) : (
            <>
              <h3 className="card-title pixel-font">最新文章</h3>
              <p className="article-excerpt">暂无文章...</p>
              <Link href="/articles" className="card-link pixel-button">
                查看所有文章
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 作品集 - 右下角 */}
      <div className="poker-card card-projects">
        <div className="poker-card-content">
          <div className="poker-card-suit">
            <span className="pixel-icon">⚙️</span>
          </div>
          <h3 className="card-title pixel-font">作品集</h3>
          {featuredProjects.length > 0 ? (
            <div className="projects-preview">
              {featuredProjects.slice(0, 2).map((project) => (
                <div key={project.id} className="project-item">
                  <h4 className="project-name pixel-font">{project.name}</h4>
                  <p className="project-description">{project.description}</p>
                  <div className="tech-stack">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="projects-placeholder">项目开发中...</p>
          )}
          <Link href="#projects" className="card-link pixel-button">
            查看所有项目
          </Link>
        </div>
      </div>

      {/* 联系方式 - 左下角 */}
      <div className="poker-card card-contact">
        <div className="poker-card-content">
          <div className="poker-card-suit">
            <span className="pixel-icon">📧</span>
          </div>
          <h3 className="card-title pixel-font">联系</h3>
          <div className="contact-links">
            <a href="mailto:contact@example.com" className="contact-link">
              <span className="pixel-icon">✉️</span>
            </a>
            <a href="https://github.com" className="contact-link">
              <span className="pixel-icon">🔗</span>
            </a>
          </div>
        </div>
      </div>

      {/* 博客 - 右上角（正方形 150×150） */}
      <Link href="/articles" className="poker-card card-blog">
        <div className="poker-card-content card-icon-center">
          <span className="pixel-icon">📝</span>
          <h3 className="card-title pixel-font">博客</h3>
        </div>
      </Link>

      {/* GitHub - 右下角（正方形 150×150） */}
      <a 
        href="https://github.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="poker-card card-github"
      >
        <div className="poker-card-content card-icon-center">
          <span className="pixel-icon">🐙</span>
          <h3 className="card-title pixel-font">GitHub</h3>
        </div>
      </a>

      {/* 时间线 - 上方外侧（长条形横置 200×100） */}
      <Link href="/timeline" className="poker-card card-timeline">
        <div className="poker-card-content card-icon-center">
          <span className="pixel-icon">📅</span>
          <h3 className="card-title pixel-font">时间线</h3>
        </div>
      </Link>

      {/* 友链 - 下方外侧（长条形横置 200×100） */}
      <Link href="/friends" className="poker-card card-friends">
        <div className="poker-card-content card-icon-center">
          <span className="pixel-icon">🔗</span>
          <h3 className="card-title pixel-font">友链</h3>
        </div>
      </Link>

      {/* 音乐 - 左侧外侧（长条形竖置 100×200） */}
      <Link href="/music" className="poker-card card-music">
        <div className="poker-card-content card-icon-center">
          <span className="pixel-icon">🎵</span>
          <h3 className="card-title pixel-font">音乐</h3>
        </div>
      </Link>

      {/* 相册 - 右侧外侧（长条形竖置 100×200） */}
      <Link href="/gallery" className="poker-card card-gallery">
        <div className="poker-card-content card-icon-center">
          <span className="pixel-icon">🖼️</span>
          <h3 className="card-title pixel-font">相册</h3>
        </div>
      </Link>
    </div>
  );
}
