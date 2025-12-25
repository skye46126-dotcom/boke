/**
 * MagneticLink 组件
 * 带有磁吸效果的链接
 */

'use client';

import React from 'react';
import { useMagnetic } from '@/lib/hooks/useMagnetic';
import { MagneticConfig } from '@/lib/interactions/magnetic';

interface MagneticLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  config?: Partial<MagneticConfig>;
  target?: string;
  rel?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export default function MagneticLink({
  href,
  children,
  className = '',
  config,
  target,
  rel,
  onClick,
}: MagneticLinkProps) {
  const magneticRef = useMagnetic(config);

  return (
    <a
      ref={magneticRef as React.RefObject<HTMLAnchorElement>}
      href={href}
      className={`magnetic-link ${className}`}
      target={target}
      rel={rel}
      onClick={onClick}
    >
      {children}
    </a>
  );
}
