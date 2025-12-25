import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="container">
      <div className="not-found">
        <h1>404</h1>
        <h2>文章未找到</h2>
        <p>抱歉，您访问的文章不存在或已被删除。</p>
        <Link href="/" className="back-home-link">
          返回首页
        </Link>
      </div>
    </main>
  );
}
