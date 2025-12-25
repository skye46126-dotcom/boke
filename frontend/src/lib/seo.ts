import { Article } from '@/types/article';

/**
 * 生成文章的 JSON-LD 结构化数据
 */
export function generateArticleJsonLd(article: Article, baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt || article.content.substring(0, 160),
    datePublished: article.created_at,
    dateModified: article.updated_at,
    author: {
      '@type': 'Person',
      name: '博主',
    },
    publisher: {
      '@type': 'Organization',
      name: '个人博客',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/articles/${article.slug}`,
    },
  };
}

/**
 * 生成网站的 JSON-LD 结构化数据
 */
export function generateWebsiteJsonLd(baseUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '个人博客',
    description: '分享技术与生活',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * 生成面包屑导航的 JSON-LD 结构化数据
 */
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
  baseUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
}
