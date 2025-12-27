/**
 * SimpleNavigation 组件
 * 用于非主页的简单导航
 */

'use client';

import React from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

interface SimpleNavigationProps {
  className?: string;
}

export default function SimpleNavigation({ className = '' }: SimpleNavigationProps) {
  return (
    <nav className={`simple-navigation ${className}`}>
      <div className="nav-container">
        <div className="nav-left">
          <Link href="/" className="nav-logo">
            <span className="logo-text">像素开发者</span>
          </Link>
        </div>
        
        <div className="nav-center">
          <div className="nav-links">
            <Link href="/articles" className="nav-link">
              文章
            </Link>
            <Link href="/projects" className="nav-link">
              项目
            </Link>
            <Link href="/about" className="nav-link">
              关于
            </Link>
          </div>
        </div>
        
        <div className="nav-right">
          <ThemeToggle variant="icon" size="sm" />
        </div>
      </div>
      
      <style jsx>{`
        .simple-navigation {
          position: sticky;
          top: 0;
          z-index: 100;
          background: var(--color-background);
          border-bottom: 1px solid var(--color-border);
          backdrop-filter: blur(10px);
        }
        
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .nav-left {
          flex: 1;
        }
        
        .nav-logo {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-text-primary);
          text-decoration: none;
        }
        
        .nav-center {
          flex: 2;
          display: flex;
          justify-content: center;
        }
        
        .nav-links {
          display: flex;
          gap: 2rem;
        }
        
        .nav-link {
          color: var(--color-text-secondary);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        
        .nav-link:hover {
          color: var(--color-text-primary);
        }
        
        .nav-right {
          flex: 1;
          display: flex;
          justify-content: flex-end;
        }
        
        @media (max-width: 768px) {
          .nav-center {
            display: none;
          }
          
          .nav-container {
            padding: 0 0.75rem;
          }
          
          .logo-text {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </nav>
  );
}