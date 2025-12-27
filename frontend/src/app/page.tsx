import type { Metadata } from 'next';
import PixelInkHomepage from '@/components/PixelInkHomepage';

// 首页 SEO metadata
export const metadata: Metadata = {
  title: '像素水墨风个人主页 - 数字世界的像素艺术家',
  description: '一个融合像素艺术与水墨美学的个人主页，采用扑克牌素材和乱中有序的便当盒布局',
  keywords: ['像素艺术', 'pixel art', '水墨风', '个人主页', '扑克牌设计', '前端开发', '作品集'],
  authors: [{ name: '像素开发者' }],
  openGraph: {
    title: '像素水墨风个人主页',
    description: '数字世界的像素艺术家 - 构建属于自己的像素宇宙',
    siteName: '像素水墨风个人主页',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '像素水墨风个人主页',
    description: '数字世界的像素艺术家',
  },
};

export default function Home() {
  return <PixelInkHomepage />;
}
