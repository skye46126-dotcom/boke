/**
 * DrawCardModal 组件
 * 抽卡弹窗系统：扑克牌翻转动画和随机内容展示
 */

'use client';

import React, { useState, useEffect } from 'react';

interface DrawCard {
  id: string;
  title: string;
  content: string;
  type: 'fortune' | 'quote' | 'tip' | 'fact';
  icon: string;
}

interface DrawCardModalProps {
  onClose: () => void;
  className?: string;
}

export default function DrawCardModal({ 
  onClose, 
  className = '' 
}: DrawCardModalProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [drawnCard, setDrawnCard] = useState<DrawCard | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // 预设卡片内容
  const cardPool: DrawCard[] = [
    {
      id: '1',
      title: '今日运势',
      content: '代码无Bug，思路清晰，今天是个适合创造的好日子！',
      type: 'fortune',
      icon: '🍀'
    },
    {
      id: '2',
      title: '编程名言',
      content: '"代码如诗，简洁而优雅。" - 每一行代码都是艺术的表达。',
      type: 'quote',
      icon: '💭'
    },
    {
      id: '3',
      title: '开发小贴士',
      content: '记住：先让代码工作，再让代码优雅，最后让代码快速。',
      type: 'tip',
      icon: '💡'
    },
    {
      id: '4',
      title: '有趣事实',
      content: '第一个计算机Bug是真的虫子！1947年Grace Hopper在计算机中发现了一只飞蛾。',
      type: 'fact',
      icon: '🐛'
    },
    {
      id: '5',
      title: '今日运势',
      content: '今天适合重构代码，整理思路，为未来的项目打下坚实基础。',
      type: 'fortune',
      icon: '⭐'
    },
    {
      id: '6',
      title: '编程名言',
      content: '"最好的代码是没有代码。" - 简单往往比复杂更难实现。',
      type: 'quote',
      icon: '🎯'
    },
    {
      id: '7',
      title: '开发小贴士',
      content: '使用有意义的变量名，你的未来自己会感谢现在的你。',
      type: 'tip',
      icon: '📝'
    },
    {
      id: '8',
      title: '有趣事实',
      content: 'JavaScript最初只用了10天时间就被创造出来！',
      type: 'fact',
      icon: '⚡'
    }
  ];

  // 弹窗显示动画
  useEffect(() => {
    setIsVisible(true);
    
    // 自动开始抽卡动画
    const timer = setTimeout(() => {
      handleDrawCard();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // 抽卡处理
  const handleDrawCard = () => {
    if (isFlipping) return;

    setIsFlipping(true);

    // 随机选择一张卡片
    const randomIndex = Math.floor(Math.random() * cardPool.length);
    const selectedCard = cardPool[randomIndex];

    // 翻转动画延迟
    setTimeout(() => {
      setDrawnCard(selectedCard);
      setIsFlipping(false);
    }, 600);
  };

  // 重新抽卡
  const handleRedraw = () => {
    setDrawnCard(null);
    setTimeout(() => {
      handleDrawCard();
    }, 200);
  };

  // 关闭弹窗
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // 获取卡片类型样式
  const getCardTypeClass = (type: string) => {
    switch (type) {
      case 'fortune': return 'card-fortune';
      case 'quote': return 'card-quote';
      case 'tip': return 'card-tip';
      case 'fact': return 'card-fact';
      default: return 'card-default';
    }
  };

  return (
    <div className={`draw-card-modal ${isVisible ? 'modal-visible' : ''} ${className}`}>
      {/* 背景遮罩 */}
      <div className="modal-overlay" onClick={handleClose} />
      
      {/* 弹窗内容 */}
      <div className="modal-content">
        {/* 关闭按钮 */}
        <button 
          className="modal-close pixel-button"
          onClick={handleClose}
          aria-label="关闭"
        >
          ✕
        </button>

        {/* 卡片区域 */}
        <div className="card-area">
          <div className={`draw-card-container ${isFlipping ? 'flipping' : ''}`}>
            {/* 卡片背面 */}
            <div className="card-back">
              <div className="card-back-pattern">
                <div className="pattern-lines"></div>
                <div className="pattern-dots"></div>
              </div>
              <div className="card-back-text pixel-font">
                {isFlipping ? '抽卡中...' : '点击抽卡'}
              </div>
            </div>

            {/* 卡片正面 */}
            {drawnCard && (
              <div className={`card-front ${getCardTypeClass(drawnCard.type)}`}>
                <div className="card-header">
                  <span className="card-icon">{drawnCard.icon}</span>
                  <h3 className="card-title pixel-font">{drawnCard.title}</h3>
                </div>
                <div className="card-content">
                  <p className="card-text">{drawnCard.content}</p>
                </div>
                <div className="card-footer">
                  <span className="card-type pixel-font">
                    {drawnCard.type === 'fortune' && '运势'}
                    {drawnCard.type === 'quote' && '名言'}
                    {drawnCard.type === 'tip' && '贴士'}
                    {drawnCard.type === 'fact' && '趣闻'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="modal-actions">
          {!drawnCard ? (
            <button 
              className="draw-button pixel-button"
              onClick={handleDrawCard}
              disabled={isFlipping}
            >
              {isFlipping ? '抽卡中...' : '开始抽卡'}
            </button>
          ) : (
            <div className="action-buttons">
              <button 
                className="redraw-button pixel-button"
                onClick={handleRedraw}
              >
                再抽一张
              </button>
              <button 
                className="close-button pixel-button"
                onClick={handleClose}
              >
                收起卡片
              </button>
            </div>
          )}
        </div>

        {/* 卡片说明 */}
        <div className="modal-description">
          <p className="description-text">
            每张卡片都包含不同的内容：运势、名言、开发贴士或有趣事实
          </p>
        </div>
      </div>
    </div>
  );
}