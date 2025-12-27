import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Press_Start_2P } from 'next/font/google';
import './globals.css';
import 'highlight.js/styles/atom-one-dark.css';
import '@/styles/theme-variables.css';
import '@/styles/theme-toggle.css';
import '@/styles/typography-longform.css';
import '@/styles/article-layout.css';
import '@/styles/table-of-contents.css';
import '@/styles/magnetic.css';
import '@/styles/heading-reveal.css';
import '@/styles/accessibility.css';
import { ThemeProvider } from '@/contexts/ThemeContext';

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: '个人博客',
    template: '%s | 个人博客',
  },
  description: '一个简洁优雅的个人博客系统，使用 Next.js 构建',
  keywords: ['博客', '个人博客', 'Next.js', 'TypeScript', '技术分享'],
  authors: [{ name: '博主' }],
  creator: '博主',
  publisher: '个人博客',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: '个人博客',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={pressStart2P.variable}>
        <ThemeProvider defaultTheme="system" storageKey="blog-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
