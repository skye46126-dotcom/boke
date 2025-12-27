/**
 * PixelPortfolio 组件
 * 像素风格扑克牌主页
 */

'use client';

import React, { useState, useEffect } from 'react';
import Card from './Card';
import ThemeToggle from './ThemeToggle';
import { ArticlesResponse, CardData } from '@/types/portfolio';
import { formatPostsToCards, shuffleArray } from '@/lib/utils/portfolio';
import styles from './PixelPortfolio.module.css';

export default function PixelPortfolio() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取卡片数据
  useEffect(() => {
    async function fetchCards() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/articles?tag=portfolio-card');
        
        if (!response.ok) {
          throw new Error('Failed to fetch cards');
        }

        const data: ArticlesResponse = await response.json();
        
        if (data.success && data.data.articles.length > 0) {
          const formattedCards = formatPostsToCards(data.data.articles);
          const shuffledCards = shuffleArray(formattedCards);
          setCards(shuffledCards);
        } else {
          setError('No cards found');
        }
      } catch (err) {
        console.error('Error fetching cards:', err);
        setError('Failed to load cards');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCards();
  }, []);

  // 抽卡处理
  const handleDrawCard = () => {
    if (isAnimating || cards.length === 0) return;

    setIsAnimating(true);

    // 播放音效（如果有）
    playDrawSound();

    // 随机选择一张卡片
    const randomIndex = Math.floor(Math.random() * cards.length);
    
    // 延迟显示卡片，创造抽卡动画效果
    setTimeout(() => {
      setCurrentCardIndex(randomIndex);
      setIsAnimating(false);
    }, 600);
  };

  // 重置
  const handleReset = () => {
    setCurrentCardIndex(null);
    setIsAnimating(false);
  };

  // 播放音效
  const playDrawSound = () => {
    // 可以添加音效
    // const audio = new Audio('/sounds/card-draw.mp3');
    // audio.play().catch(err => console.log('Audio play failed:', err));
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Loading...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p className={styles.errorText}>{error}</p>
          <p className={styles.errorHint}>
            请在管理后台创建带有 &quot;portfolio-card&quot; 标签的文章
          </p>
        </div>
      </div>
    );
  }

  // 主界面
  return (
    <div className={styles.container}>
      {/* 主题切换器 - 右上角 */}
      <div className={styles.themeToggle}>
        <ThemeToggle variant="icon" size="md" />
      </div>

      {/* 标题 */}
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome</h1>
        <p className={styles.subtitle}>抽一张卡片，探索更多</p>
      </header>

      {/* 卡片区域 */}
      <div className={styles.cardArea}>
        {currentCardIndex === null ? (
          // 牌堆状态
          <div className={styles.deck}>
            <div className={styles.deckStack}>
              {[...Array(Math.min(cards.length, 5))].map((_, i) => (
                <div
                  key={i}
                  className={styles.deckCard}
                  style={{
                    transform: `translateY(${-i * 4}px) translateX(${-i * 2}px)`,
                    zIndex: 5 - i,
                  }}
                />
              ))}
            </div>
            <p className={styles.deckCount}>{cards.length} 张卡片</p>
          </div>
        ) : (
          // 显示抽中的卡片
          <div className={styles.drawnCard}>
            <Card data={cards[currentCardIndex]} isActive={true} />
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className={styles.actions}>
        {currentCardIndex === null ? (
          <button
            className={styles.drawButton}
            onClick={handleDrawCard}
            disabled={isAnimating}
          >
            {isAnimating ? '抽卡中...' : '抽一张卡片'}
          </button>
        ) : (
          <div className={styles.actionButtons}>
            <button className={styles.resetButton} onClick={handleReset}>
              返回牌堆
            </button>
            <button className={styles.drawButton} onClick={handleDrawCard}>
              再抽一张
            </button>
          </div>
        )}
      </div>

      {/* 所有卡片预览（可选） */}
      {currentCardIndex === null && (
        <div className={styles.allCards}>
          <h2 className={styles.allCardsTitle}>或者直接浏览</h2>
          <div className={styles.cardGrid}>
            {cards.map((card) => (
              <Card key={card.id} data={card} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
