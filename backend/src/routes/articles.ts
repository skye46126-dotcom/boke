import { Router, Request, Response } from 'express';
import { param, query } from 'express-validator';
import { ArticleModel } from '../models/Article';
import { validate } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * GET /api/articles - 获取已发布的文章列表（前台）
 */
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
    validate,
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await ArticleModel.findPublished(page, limit);

    res.json({
      success: true,
      data: result,
    });
  })
);

/**
 * GET /api/articles/:slug - 根据 slug 获取文章详情（前台）
 */
router.get(
  '/:slug',
  [
    param('slug').notEmpty().trim(),
    validate,
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const article = await ArticleModel.findBySlug(slug);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    // 只返回已发布的文章
    if (article.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    res.json({
      success: true,
      data: article,
    });
  })
);

export default router;
