/**
 * BigCards 组件
 * 点击头像后展开的超大卡牌
 * 左右两侧各一张，仅显示美术素材
 */

'use client';

import React from 'react';
import Link from 'next/link';

interface BigCardsProps {
  isVisible: boolean;
  className?: string;
}

export default function BigCards({ isVisible, className = '' }: BigCardsProps) {
  return (
    <div className={`big-cards-container ${isVisible ? 'visible' : ''} ${className}`}>
      {/* 左侧大卡牌 - 仅显示美术素材 */}
      <Link 
        href="/portfolio" 
        className="big-card big-card-left" 
        style={{ backgroundImage: 'url(/left.jpeg)' }}
        aria-label="精选作品"
      />

      {/* 右侧大卡牌 - 仅显示美术素材 */}
      <Link 
        href="/articles" 
        className="big-card big-card-right" 
        style={{ backgroundImage: 'url(/right.jpeg)' }}
        aria-label="最新博客"
      />
    </div>
  );
}
