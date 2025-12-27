'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// 主题类型定义
export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

// Context 值接口
export interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  systemTheme: ResolvedTheme;
}

// Provider 属性接口
export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

// 创建 Context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// 默认配置
const DEFAULT_THEME: Theme = 'system';
const DEFAULT_STORAGE_KEY = 'theme-preference';

// 检测系统主题偏好
const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === 'undefined') return 'light';
  
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch (error) {
    console.warn('Failed to detect system theme preference:', error);
    return 'light';
  }
};

// 从 localStorage 读取主题
const getStoredTheme = (storageKey: string): Theme | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      return stored as Theme;
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
  }
  
  return null;
};

// 保存主题到 localStorage
const setStoredTheme = (theme: Theme, storageKey: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(storageKey, theme);
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
};

// 应用主题到 DOM
const applyTheme = (resolvedTheme: ResolvedTheme): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const root = document.documentElement;
    
    // 移除之前的主题类
    root.classList.remove('light', 'dark');
    
    // 添加新的主题类
    root.classList.add(resolvedTheme);
    
    // 设置 data-theme 属性用于 CSS 选择器
    root.setAttribute('data-theme', resolvedTheme);
    
    // 更新 meta theme-color 用于移动浏览器
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        resolvedTheme === 'dark' ? '#0a0a0a' : '#ffffff'
      );
    }
  } catch (error) {
    console.warn('Failed to apply theme to DOM:', error);
  }
};

// 解析主题（将 system 转换为实际主题）
const resolveTheme = (theme: Theme, systemTheme: ResolvedTheme): ResolvedTheme => {
  return theme === 'system' ? systemTheme : theme;
};

// ThemeProvider 组件
export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = DEFAULT_STORAGE_KEY,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  // 计算解析后的主题
  const resolvedTheme = resolveTheme(theme, systemTheme);

  // 初始化主题
  useEffect(() => {
    const currentSystemTheme = getSystemTheme();
    setSystemTheme(currentSystemTheme);

    // 尝试从 localStorage 读取保存的主题
    const storedTheme = getStoredTheme(storageKey);
    if (storedTheme) {
      setThemeState(storedTheme);
    }

    setIsInitialized(true);
  }, [storageKey]);

  // 监听系统主题变化
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      setSystemTheme(newSystemTheme);
    };

    // 添加监听器
    try {
      mediaQuery.addEventListener('change', handleChange);
    } catch (error) {
      // 降级到旧的 API
      mediaQuery.addListener(handleChange);
    }

    return () => {
      try {
        mediaQuery.removeEventListener('change', handleChange);
      } catch (error) {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // 应用主题到 DOM
  useEffect(() => {
    if (!isInitialized) return;
    applyTheme(resolvedTheme);
  }, [resolvedTheme, isInitialized]);

  // 监听 localStorage 变化（跨标签页同步）
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey && e.newValue) {
        const newTheme = e.newValue as Theme;
        if (['light', 'dark', 'system'].includes(newTheme)) {
          setThemeState(newTheme);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [storageKey]);

  // 设置主题函数
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    setStoredTheme(newTheme, storageKey);
  };

  // Context 值
  const contextValue: ThemeContextValue = {
    theme,
    resolvedTheme,
    setTheme,
    systemTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// useTheme Hook
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error(
      'useTheme must be used within a ThemeProvider. ' +
      'Make sure to wrap your app with <ThemeProvider>.'
    );
  }
  
  return context;
}

// 工具函数：检查是否为深色主题
export const isDarkTheme = (resolvedTheme: ResolvedTheme): boolean => {
  return resolvedTheme === 'dark';
};

// 工具函数：获取主题显示名称
export const getThemeDisplayName = (theme: Theme, systemTheme: ResolvedTheme): string => {
  switch (theme) {
    case 'light':
      return '浅色模式';
    case 'dark':
      return '深色模式';
    case 'system':
      return `跟随系统 (${systemTheme === 'dark' ? '深色' : '浅色'})`;
    default:
      return '未知主题';
  }
};