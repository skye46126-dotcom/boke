import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import 'highlight.js/styles/atom-one-dark.css';

export const metadata: Metadata = {
  title: 'Personal Blog',
  description: 'A lightweight personal blog system',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
