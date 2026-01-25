/**
 * BigCards 组件
 * 点击头像后展开的超大卡牌
 * 左右两侧各一张，仅显示美术素材
 * 左侧大王 → 大王文章，右侧小王 → 小王文章
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
      {/* 左侧大卡牌 - 大王 → 大王文章 */}
      <Link 
        href="/articles/my--self" 
        className="big-card big-card-left" 
        style={{ backgroundImage: 'url(/left.jpeg)' }}
        aria-label="大王 - 我不应该是好人"
      />

      {/* 右侧大卡牌 - 小王 → 小王文章 */}
      <Link 
        href="/articles/my-self" 
        className="big-card big-card-right" 
        style={{ backgroundImage: 'url(/right.jpeg)' }}
        aria-label="小王 - 和解"
      />
    </div>
  );
}
