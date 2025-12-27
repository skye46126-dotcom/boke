import { Router, Request, Response } from 'express';
import { body, param } from 'express-validator';
import { TagModel } from '../models/Tag';
import { validate } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { requireAdmin } from '../middleware/adminAuth';

const router = Router();

/**
 * GET /api/tags - 获取所有标签
 */
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const tags = await TagModel.findAll();

    res.json({
      success: true,
      data: tags,
    });
  })
);

/**
 * GET /api/tags/:slug - 根据 slug 获取标签
 */
router.get(
  '/:slug',
  [
    param('slug').notEmpty().trim(),
    validate,
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const { slug } = req.params;
    const tag = await TagModel.findBySlug(slug);

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found',
      });
    }

    res.json({
      success: true,
      data: tag,
    });
  })
);

/**
 * POST /api/tags - 创建新标签（管理员）
 */
router.post(
  '/',
  requireAdmin,
  [
    body('name').notEmpty().trim().isLength({ max: 100 }),
    body('slug').notEmpty().trim().isLength({ max: 100 }),
    validate,
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const { name, slug } = req.body;

    // 检查 slug 是否已存在
    const exists = await TagModel.slugExists(slug);
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Tag slug already exists',
      });
    }

    const tag = await TagModel.create({ name, slug });

    res.status(201).json({
      success: true,
      data: tag,
    });
  })
);

/**
 * DELETE /api/tags/:id - 删除标签（管理员）
 */
router.delete(
  '/:id',
  requireAdmin,
  [
    param('id').isUUID(),
    validate,
  ],
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const deleted = await TagModel.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Tag not found',
      });
    }

    res.json({
      success: true,
      message: 'Tag deleted successfully',
    });
  })
);

export default router;
