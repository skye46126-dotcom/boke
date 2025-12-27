import { Router, Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { ArticleModel } from '../models/Article';
import { TagModel } from '../models/Tag';

const router = Router();

/**
 * GET /api/stats - 获取网站统计数据
 */
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    // 获取文章总数
    const totalArticles = await ArticleModel.count();
    
    // 获取总阅读量（模拟数据，实际项目中应该有真实的阅读量统计）
    const totalViews = totalArticles * 150 + Math.floor(Math.random() * 1000);
    
    // 获取标签数量
    const totalTags = await TagModel.count();
    
    // 获取最新文章
    const result = await ArticleModel.findPublished(1, 3);
    const latestArticles = result.articles;

    res.json({
      success: true,
      data: {
        totalArticles,
        totalViews,
        totalTags,
        latestArticles: latestArticles.map(article => ({
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt || article.content.substring(0, 150) + '...',
          publishedAt: article.created_at,
          tags: article.tags || []
        }))
      },
    });
  })
);

export default router;