/**
 * NavigationCards 组件
 * 顶栏导航模块：扑克牌花色导航
 * 右上角固定定位，使用美术素材作为按钮
 * 
 * 按钮顺序：文章 → 项目 → GitHub → 关于
 * 素材对应：fangkuai(文章) → heitao(项目) → meihua(GitHub) → hongtao(关于)
 */

'use client';

import React from 'react';
import Link from 'next/link';

interface NavigationItem {
  id: string;
  label: string;
  description: string;  // 说明文字
  href: string;
  image: string;
  external?: boolean;
}

interface NavigationCardsProps {
  className?: string;
}

export default function NavigationCards({ className = '' }: NavigationCardsProps) {
  // 导航项配置 - 顺序：文章 → 项目 → GitHub → 关于
  const navigationItems: NavigationItem[] = [
    {
      id: 'articles',
      label: '文章',
      description: '文章合集',
      href: '/articles',
      image: '/fangkuai.png',
    },
    {
      id: 'projects',
      label: '项目',
      description: '项目列表',
      href: '#projects',
      image: '/heitao.png',
    },
    {
      id: 'github',
      label: 'GitHub',
      description: '代码仓库',
      href: 'https://github.com',
      image: '/meihua.png',
      external: true,
    },
    {
      id: 'about',
      label: '关于',
      description: '了解更多',
      href: '#about',
      image: '/hongtao.png',
    },
  ];

  // 渲染导航卡片
  const renderNavCard = (item: NavigationItem, index: number) => {
    const cardContent = (
      <div className="nav-card-wrapper">
        <div 
          className="nav-card"
          style={{ 
            backgroundImage: `url(${item.image})`,
          }}
        />
        <span className="nav-card-description">{item.description}</span>
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
          aria-label={item.label}
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
        aria-label={item.label}
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
