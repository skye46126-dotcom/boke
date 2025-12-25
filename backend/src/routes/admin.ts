import { Router, Request, Response } from 'express';
import { body, param } from 'express-validator';
import { ArticleModel, Article } from '../models/Article';
import { validate, sanitizeInput } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { generateSlug } from '../utils/slug';

const router = Router();

/**
 * GET /admin/articles - 获取所有文章（包括草稿）
 */
router.get(
  '/articles',
  asyncHandler(async (req: Request, res: Response) => {
    const articles = await ArticleModel.findAll();

    res.json({
      success: true,
      data: articles,
    });
  })
);

/**
 * GET /admin/articles/:id - 根据 ID 获取文章详情
 */
router.get(
  '/articles/:id',
  [
    param('id').isUUID(),
    validate,
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const article = await ArticleModel.findById(id);

    if (!article) {
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

/**
 * POST /admin/articles - 创建新文章
 */
router.post(
  '/articles',
  sanitizeInput,
  [
    body('title').notEmpty().trim().isLength({ max: 255 }),
    body('content').notEmpty().trim(),
    body('excerpt').optional().trim(),
    body('status').isIn(['draft', 'published']),
    body('slug').optional().trim(),
    validate,
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const { title, content, excerpt, status } = req.body;
    let { slug } = req.body;

    // 如果没有提供 slug，自动生成
    if (!slug) {
      slug = generateSlug(title);
    }

    // 检查 slug 是否已存在
    const slugExists = await ArticleModel.slugExists(slug);
    if (slugExists) {
      return res.status(400).json({
        success: false,
        message: 'Slug already exists. Please provide a unique slug.',
      });
    }

    const article = await ArticleModel.create({
      title,
      slug,
      content,
      excerpt,
      status,
    });

    res.status(201).json({
      success: true,
      data: article,
      message: 'Article created successfully',
    });
  })
);

/**
 * PUT /admin/articles/:id - 更新文章
 */
router.put(
  '/articles/:id',
  sanitizeInput,
  [
    param('id').isUUID(),
    body('title').optional().trim().isLength({ max: 255 }),
    body('content').optional().trim(),
    body('excerpt').optional().trim(),
    body('status').optional().isIn(['draft', 'published']),
    body('slug').optional().trim(),
    validate,
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content, excerpt, status, slug } = req.body;

    // 检查文章是否存在
    const existingArticle = await ArticleModel.findById(id);
    if (!existingArticle) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    // 如果更新 slug，检查是否已存在
    if (slug && slug !== existingArticle.slug) {
      const slugExists = await ArticleModel.slugExists(slug, id);
      if (slugExists) {
        return res.status(400).json({
          success: false,
          message: 'Slug already exists. Please provide a unique slug.',
        });
      }
    }

    const article = await ArticleModel.update(id, {
      title,
      content,
      excerpt,
      status,
      slug,
    });

    res.json({
      success: true,
      data: article,
      message: 'Article updated successfully',
    });
  })
);

/**
 * DELETE /admin/articles/:id - 删除文章
 */
router.delete(
  '/articles/:id',
  [
    param('id').isUUID(),
    validate,
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const deleted = await ArticleModel.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    res.json({
      success: true,
      message: 'Article deleted successfully',
    });
  })
);

/**
 * GET /admin/stats - 获取统计信息
 */
router.get(
  '/stats',
  asyncHandler(async (_req: Request, res: Response) => {
    const allArticles = await ArticleModel.findAll();
    
    const stats = {
      total: allArticles.length,
      published: allArticles.filter((a: Article) => a.status === 'published').length,
      draft: allArticles.filter((a: Article) => a.status === 'draft').length,
    };

    res.json({
      success: true,
      data: stats,
    });
  })
);

export default router;
