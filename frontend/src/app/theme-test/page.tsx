/**
 * 主题测试页面
 * 用于验证深色模式功能
 */

'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

export default function ThemeTestPage() {
  const { theme, resolvedTheme, systemTheme } = useTheme();

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '2rem',
      backgroundColor: 'var(--color-background)',
      color: 'var(--color-text-primary)',
      transition: 'var(--transition-theme)'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ 
          color: 'var(--color-text-primary)',
          marginBottom: '2rem'
        }}>
          深色模式测试页面
        </h1>

        {/* 主题状态信息 */}
        <div style={{
          background: 'var(--color-background-secondary)',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
            主题状态
          </h2>
          <p><strong>当前主题:</strong> {theme}</p>
          <p><strong>解析主题:</strong> {resolvedTheme}</p>
          <p><strong>系统主题:</strong> {systemTheme}</p>
        </div>

        {/* 主题切换器测试 */}
        <div style={{
          background: 'var(--color-background-secondary)',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
            主题切换器
          </h2>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <p style={{ marginBottom: '0.5rem' }}>图标样式:</p>
              <ThemeToggle variant="icon" size="md" />
            </div>
            
            <div>
              <p style={{ marginBottom: '0.5rem' }}>下拉菜单:</p>
              <ThemeToggle variant="dropdown" size="md" showLabel />
            </div>
            
            <div>
              <p style={{ marginBottom: '0.5rem' }}>分段控制:</p>
              <ThemeToggle variant="segmented" size="md" />
            </div>
          </div>
        </div>

        {/* 颜色测试 */}
        <div style={{
          background: 'var(--color-background-secondary)',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
            颜色测试
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <h3 style={{ color: 'var(--color-text-primary)' }}>文本颜色</h3>
              <p style={{ color: 'var(--color-text-primary)' }}>主要文本</p>
              <p style={{ color: 'var(--color-text-secondary)' }}>次要文本</p>
              <p style={{ color: 'var(--color-text-muted)' }}>静音文本</p>
            </div>
            
            <div>
              <h3 style={{ color: 'var(--color-text-primary)' }}>强调色</h3>
              <div style={{ 
                background: 'var(--color-accent)', 
                color: 'var(--color-text-inverse)',
                padding: '0.5rem',
                borderRadius: '4px',
                marginBottom: '0.5rem'
              }}>
                强调色
              </div>
              <div style={{ 
                background: 'var(--color-accent-light)', 
                color: 'var(--color-accent)',
                padding: '0.5rem',
                borderRadius: '4px'
              }}>
                浅色强调
              </div>
            </div>
            
            <div>
              <h3 style={{ color: 'var(--color-text-primary)' }}>语义颜色</h3>
              <div style={{ 
                background: 'var(--color-success)', 
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                marginBottom: '0.25rem',
                fontSize: '0.875rem'
              }}>
                成功
              </div>
              <div style={{ 
                background: 'var(--color-warning)', 
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                marginBottom: '0.25rem',
                fontSize: '0.875rem'
              }}>
                警告
              </div>
              <div style={{ 
                background: 'var(--color-error)', 
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                marginBottom: '0.25rem',
                fontSize: '0.875rem'
              }}>
                错误
              </div>
              <div style={{ 
                background: 'var(--color-info)', 
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.875rem'
              }}>
                信息
              </div>
            </div>
          </div>
        </div>

        {/* 链接和按钮测试 */}
        <div style={{
          background: 'var(--color-background-secondary)',
          padding: '1.5rem',
          borderRadius: '8px',
          border: '1px solid var(--color-border)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
            交互元素
          </h2>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <a 
              href="#" 
              style={{ 
                color: 'var(--color-accent)',
                textDecoration: 'none',
                borderBottom: '1px solid transparent',
                transition: 'var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-accent-hover)';
                e.currentTarget.style.borderBottomColor = 'var(--color-accent-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-accent)';
                e.currentTarget.style.borderBottomColor = 'transparent';
              }}
            >
              测试链接
            </a>
            
            <button style={{
              background: 'var(--color-accent)',
              color: 'var(--color-text-inverse)',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}>
              主要按钮
            </button>
            
            <button style={{
              background: 'transparent',
              color: 'var(--color-accent)',
              border: '1px solid var(--color-accent)',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}>
              次要按钮
            </button>
          </div>
        </div>

        {/* 返回首页 */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a 
            href="/"
            style={{
              display: 'inline-block',
              background: 'var(--color-accent)',
              color: 'var(--color-text-inverse)',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'var(--transition-fast)'
            }}
          >
            返回首页
          </a>
        </div>
      </div>
    </div>
  );
}