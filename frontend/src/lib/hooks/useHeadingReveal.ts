/**
 * useHeadingReveal Hook
 * 在 React 组件中使用标题揭示动画
 */

import { useEffect, useRef } from 'react';
import { HeadingReveal, RevealConfig } from '../interactions/heading-reveal';

export function useHeadingReveal(config?: Partial<RevealConfig>) {
  const containerRef = useRef<HTMLElement>(null);
  const revealRef = useRef<HeadingReveal | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 创建揭示实例
    revealRef.current = new HeadingReveal(config);

    // 查找所有标题
    const headings = Array.from(
      containerRef.current.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')
    );

    // 开始观察
    revealRef.current.observe(headings);

    // 清理函数
    return () => {
      if (revealRef.current) {
        revealRef.current.destroy();
        revealRef.current = null;
      }
    };
  }, [config]);

  return containerRef;
}
