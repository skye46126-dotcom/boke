'use client';

/**
 * FixedThemeToggle - 固定在右上角的主题切换按钮
 */

import ThemeToggle from './ThemeToggle';

export default function FixedThemeToggle() {
  return (
    <div style={{
      position: 'fixed',
      top: '16px',
      right: '16px',
      zIndex: 100
    }}>
      <ThemeToggle variant="compact" size="sm" />
    </div>
  );
}
