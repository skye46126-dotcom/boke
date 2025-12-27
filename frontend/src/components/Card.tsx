/**
 * Card 组件
 * 像素风格扑克牌展示组件
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { CardData } from '@/types/portfolio';
import styles from './Card.module.css';

interface CardProps {
  data: CardData;
  isActive?: boolean;
  onClick?: () => void;
}

export default function Card({ data, isActive = false, onClick }: CardProps) {
  const { category, targetUrl, content } = data;

  // 根据类别确定卡片样式类
  const cardClasses = [
    styles.card,
    styles[`card-${category}`],
    isActive ? styles.active : '',
  ].filter(Boolean).join(' ');

  // 卡片内容
  const cardContent = (
    <div className={cardClasses}>
      <div className={styles.cardInner}>
        {/* 卡片头部 */}
        <div className={styles.cardHeader}>
          <span className={styles.cardCategory}>
            {getCategoryLabel(category)}
          </span>
        </div>

        {/* 卡片主体 */}
        <div className={styles.cardBody}>
          <h3 className={styles.cardTitle}>{content.title}</h3>
          
          {content.thumbnailUrl && (
            <div className={styles.cardThumbnail}>
              <img src={content.thumbnailUrl} alt={content.title} />
            </div>
          )}
          
          {content.iconUrl && (
            <div className={styles.cardIcon}>
              <img src={content.iconUrl} alt={content.title} />
            </div>
          )}
          
          <p className={styles.cardDescription}>{content.body}</p>
        </div>

        {/* 卡片底部 */}
        {targetUrl && (
          <div className={styles.cardFooter}>
            <span className={styles.cardLink}>查看详情 →</span>
          </div>
        )}
      </div>
    </div>
  );

  // 如果有链接，包装在 Link 组件中
  if (targetUrl) {
    return (
      <Link href={targetUrl} className={styles.cardWrapper}>
        {cardContent}
      </Link>
    );
  }

  // 否则返回普通 div（带 onClick）
  return (
    <div className={styles.cardWrapper} onClick={onClick}>
      {cardContent}
    </div>
  );
}

/**
 * 获取类别标签
 */
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    about: '关于',
    skill: '技能',
    article_link: '文章',
    album_link: '相册',
    default: '其他',
  };
  return labels[category] || labels.default;
}
