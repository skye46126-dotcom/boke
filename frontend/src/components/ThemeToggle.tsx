'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, getThemeDisplayName, type Theme } from '@/contexts/ThemeContext';

// 组件属性接口
export interface ThemeToggleProps {
  variant?: 'icon' | 'dropdown' | 'segmented';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

// 主题选项
const THEME_OPTIONS: { value: Theme; label: string; icon: string }[] = [
  { value: 'light', label: '浅色模式', icon: '☀️' },
  { value: 'dark', label: '深色模式', icon: '🌙' },
  { value: 'system', label: '跟随系统', icon: '💻' },
];

// 图标样式主题切换器
function IconThemeToggle({ size = 'md', className = '' }: ThemeToggleProps) {
  const { theme, setTheme, systemTheme } = useTheme();
  
  const handleToggle = () => {
    // 循环切换：light -> dark -> system -> light
    const currentIndex = THEME_OPTIONS.findIndex(option => option.value === theme);
    const nextIndex = (currentIndex + 1) % THEME_OPTIONS.length;
    setTheme(THEME_OPTIONS[nextIndex].value);
  };

  const currentOption = THEME_OPTIONS.find(option => option.value === theme) || THEME_OPTIONS[0];
  const displayName = getThemeDisplayName(theme, systemTheme);

  const sizeClasses = {
    sm: { width: '32px', height: '32px', fontSize: '14px' },
    md: { width: '40px', height: '40px', fontSize: '16px' },
    lg: { width: '48px', height: '48px', fontSize: '18px' },
  };

  return (
    <button
      onClick={handleToggle}
      className={`theme-toggle theme-toggle-icon ${sizeClasses[size]} ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        background: 'var(--color-surface-raised)',
        border: '1px solid var(--color-border)',
        cursor: 'pointer',
        transition: 'var(--transition-theme)',
      }}
      title={`当前主题: ${displayName}，点击切换`}
      aria-label={`切换主题，当前: ${displayName}`}
      type="button"
    >
      <span 
        className="icon"
        style={{
          transition: 'transform 0.2s ease',
        }}
      >
        {currentOption.icon}
      </span>
    </button>
  );
}

// 下拉菜单主题切换器
function DropdownThemeToggle({ size = 'md', showLabel = false, className = '' }: ThemeToggleProps) {
  const { theme, setTheme, systemTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 键盘导航
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const currentOption = THEME_OPTIONS.find(option => option.value === theme) || THEME_OPTIONS[0];
  const displayName = getThemeDisplayName(theme, systemTheme);

  const sizeClasses = {
    sm: { padding: '4px 8px', fontSize: '14px' },
    md: { padding: '8px 12px', fontSize: '16px' },
    lg: { padding: '12px 16px', fontSize: '18px' },
  };

  return (
    <div className={`theme-dropdown ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="theme-toggle"
        style={{
          ...sizeClasses[size],
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderRadius: '8px',
          background: 'var(--color-surface-raised)',
          border: '1px solid var(--color-border)',
          cursor: 'pointer',
          transition: 'var(--transition-theme)',
          ...(isOpen && { boxShadow: '0 0 0 2px var(--color-accent)' })
        }}
        aria-label={`主题选择器，当前: ${displayName}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        type="button"
      >
        <span>{currentOption.icon}</span>
        {showLabel && (
          <span style={{ color: 'var(--color-text-primary)' }}>{currentOption.label}</span>
        )}
        <svg
          style={{
            width: '16px',
            height: '16px',
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="theme-dropdown-menu open"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            zIndex: 50,
            minWidth: '100%',
            marginTop: '4px',
            background: 'var(--color-surface-raised)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            boxShadow: 'var(--shadow-lg)',
            padding: '4px 0'
          }}
          role="listbox"
          aria-label="主题选项"
        >
          {THEME_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setTheme(option.value);
                setIsOpen(false);
              }}
              className="theme-dropdown-item"
              style={{
                width: '100%',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'left',
                background: theme === option.value ? 'var(--color-accent-light)' : 'transparent',
                color: theme === option.value ? 'var(--color-accent)' : 'var(--color-text-primary)',
                border: 'none',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
              role="option"
              aria-selected={theme === option.value}
            >
              <span>{option.icon}</span>
              <span>{option.label}</span>
              {theme === option.value && (
                <svg style={{ width: '16px', height: '16px', marginLeft: 'auto' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// 分段控制主题切换器
function SegmentedThemeToggle({ size = 'md', className = '' }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sizeClasses = {
    sm: { padding: '3px 6px', fontSize: '11px' },
    md: { padding: '6px 12px', fontSize: '14px' },
    lg: { padding: '8px 16px', fontSize: '16px' },
  };

  return (
    <div
      className={`theme-segmented ${className}`}
      style={{
        display: 'inline-flex',
        background: 'var(--color-surface-sunken)',
        border: '1px solid var(--color-pixel-border)',
        borderRadius: '0', /* 像素风格无圆角 */
        padding: '2px',
        gap: '1px', /* 紧凑间距 */
        /* 像素化阴影 */
        boxShadow: 'inset 1px 1px 0 var(--color-pixel-shadow)',
      }}
      role="radiogroup"
      aria-label="主题选择"
    >
      {THEME_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => setTheme(option.value)}
          className="theme-segmented-item pixel-button"
          style={{
            ...sizeClasses[size],
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            borderRadius: '0', /* 像素风格方块 */
            border: theme === option.value ? '1px solid var(--color-pixel-accent)' : '1px solid transparent',
            cursor: 'pointer',
            transition: 'var(--transition-fast)',
            background: theme === option.value ? 'var(--color-pixel-card-bg)' : 'transparent',
            color: theme === option.value ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            fontFamily: 'var(--font-pixel), monospace',
            fontSize: '10px',
            fontWeight: 'bold',
            /* 选中态像素高亮边框 */
            ...(theme === option.value && { 
              boxShadow: '0 0 0 1px var(--color-pixel-accent), inset 0 0 0 1px var(--color-pixel-accent)' 
            })
          }}
          role="radio"
          aria-checked={theme === option.value}
          aria-label={option.label}
          type="button"
        >
          <span>{option.icon}</span>
          {!isMobile && <span>{option.label}</span>}
        </button>
      ))}
    </div>
  );
}

// 主要的 ThemeToggle 组件
export function ThemeToggle(props: ThemeToggleProps) {
  const { variant = 'icon' } = props;

  switch (variant) {
    case 'dropdown':
      return <DropdownThemeToggle {...props} />;
    case 'segmented':
      return <SegmentedThemeToggle {...props} />;
    case 'icon':
    default:
      return <IconThemeToggle {...props} />;
  }
}

export default ThemeToggle;