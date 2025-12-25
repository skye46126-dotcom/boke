import { NextRequest, NextResponse } from 'next/server';
import { ArticleModel } from '../../../../lib/models/Article';
import { withErrorHandler } from '../../../../lib/middleware/validation';
import { getCacheHeaders } from '../../../../lib/utils/cache';

/**
 * GET /api/articles - 获取已发布的文章列表（前台）
 */
export const GET = withErrorHandler(async (req: NextRequest) => {
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1', 10);
  const limit = parseInt(url.searchParams.get('limit') || '10', 10);

  // 验证参数
  if (page < 1 || limit < 1 || limit > 50) {
    return NextResponse.json(
      { success: false, message: 'Invalid pagination parameters' },
      { status: 400 }
    );
  }

  const result = await ArticleModel.findPublished(page, limit);

  return NextResponse.json(
    {
      success: true,
      data: result,
    },
    {
      headers: getCacheHeaders('ARTICLE_LIST'),
    }
  );
});