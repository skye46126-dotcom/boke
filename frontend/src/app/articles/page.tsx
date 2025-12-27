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
      <div className="articles-page">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">文章列表</h1>
          <ArticlesClient />
        </div>
      </div>
    </>
  );
}