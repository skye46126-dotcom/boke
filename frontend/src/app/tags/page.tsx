import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllTags } from '@/content/tags';
import FixedThemeToggle from '@/components/FixedThemeToggle';
import '@/styles/tags.css';

export const metadata: Metadata = {
  title: '标签 - 像素开发者',
  description: '按标签浏览文章',
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="tags-page">
      <FixedThemeToggle />
      
      <div className="container mx-auto px-4 py-8">
        <header className="tags-header">
          <Link href="/articles" className="back-link">
            ← 返回文章
          </Link>
          <h1>🏷️ 标签</h1>
          <p className="tags-count">共 {tags.length} 个标签</p>
        </header>

        {tags.length === 0 ? (
          <div className="tags-empty">暂无标签</div>
        ) : (
          <div className="tags-grid">
            {tags.map((tag) => (
              <Link
                key={tag.name}
                href={`/tags/${encodeURIComponent(tag.name)}`}
                className="tag-card"
              >
                <span className="tag-name">{tag.name}</span>
                <span className="tag-count">{tag.count} 篇</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
