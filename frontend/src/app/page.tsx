import ArticleList from '@/components/ArticleList';
import Pagination from '@/components/Pagination';
import { PaginatedArticles, ApiResponse } from '@/types/article';

async function getArticles(page: number = 1): Promise<PaginatedArticles> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/articles?page=${page}&limit=10`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch articles');
    }

    const response: ApiResponse<PaginatedArticles> = await res.json();
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return {
      articles: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    };
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1', 10);
  const data = await getArticles(page);

  return (
    <main className="container">
      <header className="blog-header">
        <h1>个人博客</h1>
        <p>分享技术与生活</p>
      </header>

      <ArticleList articles={data.articles} />
      
      <Pagination
        currentPage={data.pagination.page}
        totalPages={data.pagination.totalPages}
        baseUrl="/"
      />
    </main>
  );
}
