/**
 * useMagnetic Hook
 * 在 React 组件中使用磁吸效果
 */

import { useEffect, useRef } from 'react';
import { MagneticElement, MagneticConfig } from '../interactions/magnetic';

export function useMagnetic(config?: Partial<MagneticConfig>) {
  const elementRef = useRef<HTMLElement>(null);
  const magneticRef = useRef<MagneticElement | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    // 创建磁吸实例
    magneticRef.current = new MagneticElement(elementRef.current, config);

    // 清理函数
    return () => {
      if (magneticRef.current) {
        magneticRef.current.destroy();
        magneticRef.current = null;
      }
    };
  }, [config]);

  return elementRef;
}

/**
 * useMagneticMultiple Hook
 * 为多个元素应用磁吸效果
 */
export function useMagneticMultiple(
  selector: string,
  config?: Partial<MagneticConfig>
) {
  const instancesRef = useRef<MagneticElement[]>([]);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    
    // 创建磁吸实例
    elements.forEach((element) => {
      const instance = new MagneticElement(element, config);
      instancesRef.current.push(instance);
    });

    // 清理函数
    return () => {
      instancesRef.current.forEach((instance) => instance.destroy());
      instancesRef.current = [];
    };
  }, [selector, config]);

  return instancesRef;
}
