/**
 * Portfolio Card Types
 * 像素扑克牌主页的类型定义
 */

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  published_at: string | null;
  tags?: Tag[];
}

export type CardCategory = 'about' | 'skill' | 'article_link' | 'album_link' | 'default';

export interface CardContent {
  title: string;
  body: string;
  thumbnailUrl?: string;
  iconUrl?: string;
}

export interface CardData {
  id: string;
  category: CardCategory;
  targetUrl: string | null;
  content: CardContent;
}

export interface ArticlesResponse {
  success: boolean;
  data: {
    articles: Article[];
    total: number;
    page: number;
    totalPages: number;
  };
}
