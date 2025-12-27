/**
 * NavigationCards 组件
 * 顶栏导航模块：扑克牌花色导航
 * 右上角固定定位，使用美术素材作为按钮
 * 
 * 按钮顺序：文章 → 项目 → GitHub → 关于
 * 素材对应：fangkuai(文章) → heitao(项目) → meihua(GitHub) → hongtao(关于)
 * 
 * 磁吸效果：小卡牌使用 useMagnetic hook，偏移幅度≤5px
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useMagnetic } from '@/lib/hooks/useMagnetic';

interface NavigationItem {
  id: string;
  label: string;
  description: string;
  href: string;
  image: string;
  external?: boolean;
}

interface NavigationCardsProps {
  className?: string;
}

// 磁吸导航卡片 - 内部链接
function MagneticNavCard({ item, index }: { item: NavigationItem; index: number }) {
  // 磁吸配置：strength 0.3 让效果更明显，radius 80px
  const magneticRef = useMagnetic({ strength: 0.3, radius: 80 });

  return (
    <Link 
      ref={magneticRef as React.RefObject<HTMLAnchorElement>}
      href={item.href} 
      className="nav-card-link magnetic-nav-card"
      style={{ transitionDelay: `${index * 0.1}s` }}
      aria-label={item.label}
    >
      <div className="nav-card-wrapper">
        <div className="nav-card" style={{ backgroundImage: `url(${item.image})` }} />
        <span className="nav-card-description">{item.description}</span>
      </div>
    </Link>
  );
}

// 磁吸导航卡片 - 外部链接
function MagneticExternalNavCard({ item, index }: { item: NavigationItem; index: number }) {
  const magneticRef = useMagnetic({ strength: 0.3, radius: 80 });

  return (
    <a
      ref={magneticRef as React.RefObject<HTMLAnchorElement>}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="nav-card-link magnetic-nav-card"
      style={{ transitionDelay: `${index * 0.1}s` }}
      aria-label={item.label}
    >
      <div className="nav-card-wrapper">
        <div className="nav-card" style={{ backgroundImage: `url(${item.image})` }} />
        <span className="nav-card-description">{item.description}</span>
      </div>
    </a>
  );
}

export default function NavigationCards({ className = '' }: NavigationCardsProps) {
  const navigationItems: NavigationItem[] = [
    { id: 'articles', label: '文章', description: '文章合集', href: '/articles', image: '/fangkuai.png' },
    { id: 'projects', label: '项目', description: '项目列表', href: '#projects', image: '/heitao.png' },
    { id: 'github', label: 'GitHub', description: '代码仓库', href: 'https://github.com', image: '/meihua.png', external: true },
    { id: 'about', label: '关于', description: '了解更多', href: '#about', image: '/hongtao.png' },
  ];

  return (
    <nav className={`nav-container ${className}`}>
      <div className="nav-trigger">
        <span className="trigger-icon">☰</span>
      </div>
      <div className="nav-cards-wrapper">
        {navigationItems.map((item, index) => 
          item.external 
            ? <MagneticExternalNavCard key={item.id} item={item} index={index} />
            : <MagneticNavCard key={item.id} item={item} index={index} />
        )}
      </div>
    </nav>
  );
}
