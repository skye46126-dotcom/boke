import { MetadataRoute } from 'next';

async function getArticles() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/articles?limit=1000`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return [];
    }

    const response = await res.json();
    return response.data.articles || [];
  } catch (error) {
    console.error('Error fetching articles for sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const articles = await getArticles();

  const articleUrls = articles.map((article: any) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...articleUrls,
  ];
}
