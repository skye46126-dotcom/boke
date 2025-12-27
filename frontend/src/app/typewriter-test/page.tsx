/**
 * 打字机效果测试页面
 */

'use client';

import React from 'react';
import CoreAnchor from '@/components/CoreAnchor';
import { ThemeProvider } from '@/contexts/ThemeContext';

// 导入必要的 CSS 样式
import '@/styles/pixel-ink-system.css';
import '@/styles/core-anchor.css';

export default function TypewriterTestPage() {
  return (
    <ThemeProvider>
      <div style={{ 
        minHeight: '100vh', 
        background: '#181818',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '40px'
      }}>
        <h1 style={{ color: '#4a7a96', fontFamily: 'monospace' }}>
          打字机效果测试
        </h1>
        
        {/* 圆形头像样式 */}
        <div style={{ position: 'relative', height: '300px', width: '300px' }}>
          <h2 style={{ color: '#8c6b48', fontFamily: 'monospace', textAlign: 'center' }}>
            圆形头像样式
          </h2>
          <CoreAnchor avatarStyle="circle" />
        </div>
        
        {/* 电视机框样式 */}
        <div style={{ position: 'relative', height: '300px', width: '300px' }}>
          <h2 style={{ color: '#8c6b48', fontFamily: 'monospace', textAlign: 'center' }}>
            电视机框样式
          </h2>
          <CoreAnchor avatarStyle="tv" />
        </div>
      </div>
    </ThemeProvider>
  );
}