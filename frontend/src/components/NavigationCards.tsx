/**
 * NavigationCards 组件
 * 顶栏导航模块：扑克牌样式导航卡片
 * 支持响应式布局和交互动效
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
      icon: '📖', // 可以替换为像素书型图标
    },
    {
      id: 'about',
      label: '关于',
      href: '#about',
      icon: '👤', // 可以替换为像素个人图标
    },
    {
      id: 'projects',
      label: '项目',
      href: '#projects',
      icon: '⚙️', // 可以替换为像素齿轮图标
    },
    {
      id: 'github',
      label: 'GitHub',
      href: 'https://github.com',
      icon: '🔗', // 可以替换为像素Git图标
      external: true,
    },
  ];

  // 处理导航点击
  const handleNavClick = (item: NavigationItem) => {
    // 可以添加点击音效或其他交互逻辑
    console.log(`Navigating to: ${item.label}`);
  };

  // 渲染导航卡片
  const renderNavCard = (item: NavigationItem, index: number) => {
    const cardContent = (
      <div 
        className={`nav-card poker-card poker-card-nav ${index === 2 ? 'nav-card-offset' : ''}`}
        onClick={() => handleNavClick(item)}
      >
        <div className="poker-card-content">
          {/* 花色图标 */}
          <div className="poker-card-suit">
            <span className="pixel-icon">{item.icon}</span>
          </div>
          
          {/* 卡片文字 */}
          <div className="nav-card-text">
            <span className="pixel-font">{item.label}</span>
          </div>
        </div>
      </div>
    );

    // 根据是否为外部链接选择包装组件
    if (item.external) {
      return (
        <a
          key={item.id}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="nav-card-link"
        >
          {cardContent}
        </a>
      );
    }

    return (
      <Link key={item.id} href={item.href} className="nav-card-link">
        {cardContent}
      </Link>
    );
  };

  return (
    <nav className={`navigation-cards ${className}`}>
      <div className="nav-cards-container">
        {navigationItems.map((item, index) => renderNavCard(item, index))}
      </div>
    </nav>
  );
}