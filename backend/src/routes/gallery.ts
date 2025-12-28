/**
 * Gallery Routes - 相册 API 路由
 * 
 * 公开接口：
 * - GET /api/gallery - 获取相册列表（支持分类筛选）
 * - GET /api/gallery/categories - 获取所有分类
 * - GET /api/gallery/showcase - 获取长廊展示图片
 * - GET /api/gallery/:id - 获取单个相册项
 * 
 * 管理接口（需要认证）：
 * - POST /api/gallery - 创建相册项
 * - PUT /api/gallery/:id - 更新相册项
 * - PUT /api/gallery/showcase/config - 更新长廊配置
 * - DELETE /api/gallery/:id - 删除相册项
 */

import { Router, Request, Response } from 'express';
import { GalleryModel, CreateGalleryData, UpdateGalleryData } from '../models/Gallery';

const router = Router();

// ========================================
// 公开接口
// ========================================

/**
 * GET /api/gallery
 * 获取相册列表，支持分类筛选和分页
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const category = req.query.category as string;

    const result = await GalleryModel.findPaginated(page, limit, category);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery',
    });
  }
});

/**
 * GET /api/gallery/categories
 * 获取所有分类列表
 */
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await GalleryModel.getCategories();

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
    });
  }
});

// ========================================
// 长廊展示接口（放在 :id 路由之前）
// ========================================

/**
 * GET /api/gallery/showcase
 * 获取长廊展示图片列表
 */
router.get('/showcase', async (_req: Request, res: Response) => {
  try {
    const items = await GalleryModel.findShowcaseItems();
    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching showcase items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch showcase items',
    });
  }
});

/**
 * PUT /api/gallery/showcase/config
 * 更新长廊展示配置（批量）
 */
router.put('/showcase/config', async (req: Request, res: Response) => {
  try {
    const { items } = req.body as { items: { id: string; showcase_order: number | null }[] };
    
    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required',
      });
    }

    await GalleryModel.updateShowcaseConfig(items);
    
    // 返回更新后的长廊列表
    const updatedItems = await GalleryModel.findShowcaseItems();
    
    res.json({
      success: true,
      data: updatedItems,
    });
  } catch (error) {
    console.error('Error updating showcase config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update showcase config',
    });
  }
});


// ========================================
// 单项接口（:id 路由）
// ========================================

/**
 * GET /api/gallery/:id
 * 获取单个相册项
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await GalleryModel.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
      });
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error('Error fetching gallery item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery item',
    });
  }
});

// ========================================
// 管理接口（与 Admin 页面集成）
// ========================================

/**
 * POST /api/gallery
 * 创建相册项
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, img_url, category, description, album_id } = req.body as CreateGalleryData;

    // 验证必填字段
    if (!title || !img_url || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, img_url, and category are required',
      });
    }

    const item = await GalleryModel.create({
      title,
      img_url,
      category,
      description,
      album_id,
    });

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create gallery item',
    });
  }
});

/**
 * PUT /api/gallery/:id
 * 更新相册项
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body as UpdateGalleryData;

    const item = await GalleryModel.update(id, updateData);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
      });
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error('Error updating gallery item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update gallery item',
    });
  }
});

/**
 * DELETE /api/gallery/:id
 * 删除相册项
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await GalleryModel.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found',
      });
    }

    res.json({
      success: true,
      message: 'Gallery item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete gallery item',
    });
  }
});

export default router;
