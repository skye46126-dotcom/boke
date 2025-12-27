import type { Metadata } from 'next';
import ArticlesClient from './ArticlesClient';
import SimpleNavigation from '@/components/SimpleNavigation';

export const metadata: Metadata = {
  title: '文章列表 - 像素开发者',
  description: '浏览所有技术文章和博客内容',
};

export default function ArticlesPage() {
  return (
    <>
      <SimpleNavigation />
      <div className="articles-page" style={{ 
        background: 'var(--color-background)', 
        minHeight: '100vh',
        transition: 'background 0.3s ease'
      }}>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--color-text-primary)' }}>
            文章列表
          </h1>
          <ArticlesClient />
        </div>
      </div>
    </>
  );
}