/**
 * NavigationCards 组件
 * 顶栏导航模块：抽卡式扑克牌导航
 * 右上角固定定位，hover展开卡牌
 */

'use client';

import React from 'react';
import Link from 'next/link';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  external?: boolean;
}

interface NavigationCardsProps {
  className?: string;
}

export default function NavigationCards({ className = '' }: NavigationCardsProps) {
  // 导航项配置
  const navigationItems: NavigationItem[] = [
    {
      id: 'articles',
      label: '文章',
      href: '/articles',
      icon: '📖',
    },
    {
      id: 'about',
      label: '关于',
      href: '#about',
      icon: '👤',
    },
    {
      id: 'projects',
      label: '项目',
      href: '#projects',
      icon: '⚙️',
    },
    {
      id: 'github',
      label: 'GitHub',
      href: 'https://github.com',
      icon: '🔗',
      external: true,
    },
  ];

  // 渲染导航卡片
  const renderNavCard = (item: NavigationItem, index: number) => {
    const cardContent = (
      <div 
        className="nav-card"
        style={{ transitionDelay: `${index * 0.1}s` }}
      >
        <div className="nav-card-content">
          <div className="nav-card-suit">
            <span className="pixel-icon">{item.icon}</span>
          </div>
          <div className="nav-card-text">
            <span className="pixel-font">{item.label}</span>
          </div>
        </div>
      </div>
    );

    if (item.external) {
      return (
        <a
          key={item.id}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-card-link"
          style={{ transitionDelay: `${index * 0.1}s` }}
        >
          {cardContent}
        </a>
      );
    }

    return (
      <Link 
        key={item.id} 
        href={item.href} 
        className="nav-card-link"
        style={{ transitionDelay: `${index * 0.1}s` }}
      >
        {cardContent}
      </Link>
    );
  };

  return (
    <nav className={`nav-container ${className}`}>
      {/* 触发按钮 */}
      <div className="nav-trigger">
        <span className="trigger-icon">☰</span>
      </div>
      
      {/* 导航卡牌容器 */}
      <div className="nav-cards-wrapper">
        {navigationItems.map((item, index) => renderNavCard(item, index))}
      </div>
    </nav>
  );
}
