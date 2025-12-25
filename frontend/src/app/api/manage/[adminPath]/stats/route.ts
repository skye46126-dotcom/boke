import { NextResponse } from 'next/server';
import { ArticleModel, Article } from '../../../../../../lib/models/Article';
import { withErrorHandler, withAdminAuth } from '../../../../../../lib/middleware/validation';

/**
 * GET /api/manage/[adminPath]/stats - 获取统计信息（管理后台）
 */
export const GET = withAdminAuth(withErrorHandler(async () => {
  const allArticles = await ArticleModel.findAll();
  
  const stats = {
    total: allArticles.length,
    published: allArticles.filter((a: Article) => a.status === 'published').length,
    draft: allArticles.filter((a: Article) => a.status === 'draft').length,
  };

  return NextResponse.json({
    success: true,
    data: stats,
  });
}));