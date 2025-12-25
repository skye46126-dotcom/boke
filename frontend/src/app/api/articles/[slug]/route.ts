import { NextRequest, NextResponse } from 'next/server';
import { ArticleModel } from '../../../../../lib/models/Article';
import { withErrorHandler } from '../../../../../lib/middleware/validation';
import { getCacheHeaders } from '../../../../../lib/utils/cache';

/**
 * GET /api/articles/[slug] - 根据 slug 获取文章详情（前台）
 */
export const GET = withErrorHandler(async (
  req: NextRequest,
  { params }: { params: { slug: string } }
) => {
  const { slug } = params;

  if (!slug || slug.trim().length === 0) {
    return NextResponse.json(
      { success: false, message: 'Invalid slug' },
      { status: 400 }
    );
  }

  const article = await ArticleModel.findBySlug(slug);

  if (!article) {
    return NextResponse.json(
      { success: false, message: 'Article not found' },
      { status: 404 }
    );
  }

  // 只返回已发布的文章
  if (article.status !== 'published') {
    return NextResponse.json(
      { success: false, message: 'Article not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      data: article,
    },
    {
      headers: getCacheHeaders('ARTICLE_DETAIL'),
    }
  );
});