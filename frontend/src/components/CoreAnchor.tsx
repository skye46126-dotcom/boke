/**
 * CoreAnchor 组件
 * 核心锚点模块：头像容器 + 打字机效果
 * 支持响应式布局和两种头像样式（圆形/电视机框）
 * 
 * 打字机实现：使用 React 状态驱动的逐帧打字，兼容 Strict Mode
 */

'use client';

import React, { useState, useEffect } from 'react';
import PixelImage from './PixelImage';

interface CoreAnchorProps {
  avatarStyle?: 'circle' | 'tv';
  className?: string;
}

// 打字机效果配置
const TEXTS = [
  "正在构建我的数字世界...",
  "欢迎光临，抽一张运势卡？",
  "作品集持续更新中..."
];
const TYPE_SPEED = 100;      // 打字速度 100ms/字
const PAUSE_AFTER_TYPE = 500; // 打完停顿 500ms
const DELETE_SPEED = 50;      // 删除速度 50ms/字
const PAUSE_AFTER_DELETE = 750; // 删除后停顿 750ms

// 打字机状态阶段
type Phase = 'typing' | 'pause-after-type' | 'deleting' | 'pause-after-delete';

export default function CoreAnchor({ 
  avatarStyle = 'circle', 
  className = '' 
}: CoreAnchorProps) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('typing');

  // 状态驱动的打字机效果 - 兼容 React Strict Mode
  useEffect(() => {
    const currentFullText = TEXTS[textIndex];
    let timeoutId: NodeJS.Timeout;

    switch (phase) {
      case 'typing':
        if (charIndex < currentFullText.length) {
          // 逐字打字
          timeoutId = setTimeout(() => {
            setDisplayText(currentFullText.slice(0, charIndex + 1));
            setCharIndex(prev => prev + 1);
          }, TYPE_SPEED);
        } else {
          // 打字完成，进入停顿
          timeoutId = setTimeout(() => {
            setPhase('pause-after-type');
          }, PAUSE_AFTER_TYPE);
        }
        break;

      case 'pause-after-type':
        // 停顿结束，开始删除
        timeoutId = setTimeout(() => {
          setPhase('deleting');
        }, 0);
        break;

      case 'deleting':
        if (charIndex > 0) {
          // 逐字删除
          timeoutId = setTimeout(() => {
            setCharIndex(prev => prev - 1);
            setDisplayText(currentFullText.slice(0, charIndex - 1));
          }, DELETE_SPEED);
        } else {
          // 删除完成，进入停顿
          timeoutId = setTimeout(() => {
            setPhase('pause-after-delete');
          }, PAUSE_AFTER_DELETE);
        }
        break;

      case 'pause-after-delete':
        // 停顿结束，切换到下一条文本
        timeoutId = setTimeout(() => {
          setTextIndex(prev => (prev + 1) % TEXTS.length);
          setCharIndex(0);
          setDisplayText('');
          setPhase('typing');
        }, 0);
        break;
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [phase, charIndex, textIndex]);

  return (
    <div className={`core-anchor ${className}`}>
      {/* 头像容器 */}
      <div className={`avatar-container avatar-${avatarStyle}`}>
        {avatarStyle === 'circle' ? (
          // 圆形像素头像
          <div className="avatar-circle">
            <PixelImage 
              src="/images/avatar.svg" 
              alt="头像"
              className="avatar-image"
              width={200}
              height={200}
            />
          </div>
        ) : (
          // 像素电视机框
          <div className="avatar-tv">
            <div className="tv-frame">
              <div className="tv-screen">
                <PixelImage 
                  src="/images/avatar.svg" 
                  alt="头像"
                  className="avatar-image"
                  width={180}
                  height={150}
                />
              </div>
              <div className="tv-buttons">
                <div className="tv-button"></div>
                <div className="tv-button"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 打字机效果 */}
      <div className="typewriter-container">
        <div className="typewriter-box">
          <span className="typewriter-text pixel-font">
            {displayText}
          </span>
          <span className="typewriter-cursor"></span>
        </div>
      </div>
    </div>
  );
}