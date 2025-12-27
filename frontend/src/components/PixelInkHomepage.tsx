/**
 * PixelInkHomepage 组件
 * 像素水墨风+扑克牌素材个人主页
 * 严格遵循"乱中有序的便当盒布局"和"像素水墨+扑克牌"风格规范
 * 
 * 动画顺序控制：
 * - 展开：先收小卡牌(0.6s) → 再放大卡牌(0.5s)
 * - 收起：先收大卡牌(0.6s) → 再放小卡牌(0.5s)
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import CoreAnchor from './CoreAnchor';
import NavigationCards from './NavigationCards';
import FunctionCards from './FunctionCards';
import DrawCardModal from './DrawCardModal';
import BigCards from './BigCards';
import { useTheme } from '@/contexts/ThemeContext';

// 导入像素风格样式（仅在主页使用）
import '@/styles/pixel-ink-system.css';
import '@/styles/pixel-ink-homepage.css';
import '@/styles/navigation-cards.css';
import '@/styles/function-cards.css';
import '@/styles/draw-card-modal.css';
import '@/styles/big-cards.css';
import '@/styles/core-anchor.css';

interface PixelInkHomepageProps {
  className?: string;
}

// 动画阶段状态
type AnimationPhase = 
  | 'idle'                    // 初始状态：小卡牌展开，大卡牌隐藏
  | 'collapsing-small'        // 正在收起小卡牌
  | 'expanding-big'           // 正在展开大卡牌
  | 'active'                  // 激活状态：小卡牌收起，大卡牌展开
  | 'collapsing-big'          // 正在收起大卡牌
  | 'expanding-small';        // 正在展开小卡牌

// 动画时长常量
const SMALL_CARD_COLLAPSE_DURATION = 600;  // 小卡牌收起 0.6s
const BIG_CARD_EXPAND_DURATION = 500;      // 大卡牌展开 0.5s
const BIG_CARD_COLLAPSE_DURATION = 600;    // 大卡牌收起 0.6s
const SMALL_CARD_EXPAND_DURATION = 500;    // 小卡牌展开 0.5s

export default function PixelInkHomepage({ className = '' }: PixelInkHomepageProps) {
  const { theme } = useTheme();
  const [isDrawModalOpen, setIsDrawModalOpen] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('idle');
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 主题变化时的处理
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  // 处理抽卡机点击
  const handleDrawCardClick = useCallback(() => {
    setIsDrawModalOpen(true);
  }, []);

  // 关闭抽卡弹窗
  const handleCloseDrawModal = useCallback(() => {
    setIsDrawModalOpen(false);
  }, []);

  // 处理头像点击 - 触发动画序列
  const handleAvatarClick = useCallback(() => {
    // 如果正在动画中，忽略点击
    if (animationPhase !== 'idle' && animationPhase !== 'active') {
      return;
    }

    // 清理之前的定时器
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    if (animationPhase === 'idle') {
      // 展开流程：先收小卡牌 → 再放大卡牌
      setAnimationPhase('collapsing-small');
      
      // 小卡牌收起动画结束后，展开大卡牌
      animationTimeoutRef.current = setTimeout(() => {
        setAnimationPhase('expanding-big');
        
        // 大卡牌展开动画结束后，进入激活状态
        animationTimeoutRef.current = setTimeout(() => {
          setAnimationPhase('active');
        }, BIG_CARD_EXPAND_DURATION);
      }, SMALL_CARD_COLLAPSE_DURATION);
    } else if (animationPhase === 'active') {
      // 收起流程：先收大卡牌 → 再放小卡牌
      setAnimationPhase('collapsing-big');
      
      // 大卡牌收起动画结束后，展开小卡牌
      animationTimeoutRef.current = setTimeout(() => {
        setAnimationPhase('expanding-small');
        
        // 小卡牌展开动画结束后，回到初始状态
        animationTimeoutRef.current = setTimeout(() => {
          setAnimationPhase('idle');
        }, SMALL_CARD_EXPAND_DURATION);
      }, BIG_CARD_COLLAPSE_DURATION);
    }
  }, [animationPhase]);

  // 计算各组件的显示状态
  const isSmallCardsCollapsed = 
    animationPhase === 'collapsing-small' || 
    animationPhase === 'expanding-big' || 
    animationPhase === 'active' ||
    animationPhase === 'collapsing-big';

  const isBigCardsVisible = 
    animationPhase === 'expanding-big' || 
    animationPhase === 'active';

  const isAvatarActive = animationPhase !== 'idle';

  // 生成动画阶段的 CSS 类名
  const getAnimationClass = () => {
    switch (animationPhase) {
      case 'collapsing-small':
        return 'phase-collapsing-small';
      case 'expanding-big':
        return 'phase-expanding-big';
      case 'active':
        return 'phase-active';
      case 'collapsing-big':
        return 'phase-collapsing-big';
      case 'expanding-small':
        return 'phase-expanding-small';
      default:
        return 'phase-idle';
    }
  };

  return (
    <div 
      className={`pixel-ink-homepage ${getAnimationClass()} ${className}`} 
      data-theme={theme}
    >
      {/* 顶栏导航 - 不受头像点击影响 */}
      <NavigationCards />

      {/* 主要内容区域 - 头像居中，卡牌围绕 */}
      <main className="homepage-main homepage-main-full">
        {/* 中心布局容器：头像为锚点，卡牌围绕 */}
        <div className="center-layout-container">
          {/* 核心锚点（头像+打字机文字）- 可点击触发卡牌动画 */}
          <CoreAnchor onAvatarClick={handleAvatarClick} isActive={isAvatarActive} />
          
          {/* 功能卡片（绝对定位围绕头像） */}
          <FunctionCards 
            onDrawCardClick={handleDrawCardClick} 
            isCollapsed={isSmallCardsCollapsed}
          />
          
          {/* 超大卡牌（点击头像后展开） */}
          <BigCards isVisible={isBigCardsVisible} />
        </div>
      </main>

      {/* 抽卡弹窗 */}
      {isDrawModalOpen && (
        <DrawCardModal onClose={handleCloseDrawModal} />
      )}
    </div>
  );
}
