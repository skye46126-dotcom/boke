/**
 * PixelInkHomepage 组件
 * 像素水墨风+扑克牌素材个人主页
 * 严格遵循"乱中有序的便当盒布局"和"像素水墨+扑克牌"风格规范
 * 
 * 更新：移除左侧侧边栏，主内容区自动填充全部空间
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import CoreAnchor from './CoreAnchor';
import NavigationCards from './NavigationCards';
import FunctionCards from './FunctionCards';
import DrawCardModal from './DrawCardModal';
import { useTheme } from '@/contexts/ThemeContext';

// 导入像素风格样式（仅在主页使用）
// 注意：导入顺序很重要，全局样式先导入，组件私有样式后导入以获得更高优先级
import '@/styles/pixel-ink-system.css';
import '@/styles/pixel-ink-homepage.css';  // 全局主页样式先导入
import '@/styles/navigation-cards.css';
import '@/styles/function-cards.css';
import '@/styles/draw-card-modal.css';
import '@/styles/core-anchor.css';  // 核心锚点样式最后导入，确保不被覆盖

interface PixelInkHomepageProps {
  className?: string;
}

export default function PixelInkHomepage({ className = '' }: PixelInkHomepageProps) {
  const { theme } = useTheme();
  const [isDrawModalOpen, setIsDrawModalOpen] = useState(false);

  // 主题变化时的处理
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // 处理抽卡机点击
  const handleDrawCardClick = useCallback(() => {
    setIsDrawModalOpen(true);
  }, []);

  // 关闭抽卡弹窗
  const handleCloseDrawModal = useCallback(() => {
    setIsDrawModalOpen(false);
  }, []);

  return (
    <div 
      className={`pixel-ink-homepage ${className}`} 
      data-theme={theme}
    >
      {/* 顶栏导航 */}
      <NavigationCards />

      {/* 主要内容区域 - 头像居中，卡牌围绕 */}
      <main className="homepage-main homepage-main-full">
        {/* 中心布局容器：头像为锚点，卡牌围绕 */}
        <div className="center-layout-container">
          {/* 核心锚点（头像+打字机文字）- 作为定位参考中心 */}
          <CoreAnchor />
          
          {/* 功能卡片（绝对定位围绕头像） */}
          <FunctionCards onDrawCardClick={handleDrawCardClick} />
        </div>
      </main>

      {/* 抽卡弹窗 */}
      {isDrawModalOpen && (
        <DrawCardModal onClose={handleCloseDrawModal} />
      )}
    </div>
  );
}
