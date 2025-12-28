/**
 * Gallery Albums Routes - 图片集 API 路由
 */

import { Router, Request, Response } from 'express';
import { GalleryAlbumModel } from '../models/GalleryAlbum';
import { GalleryModel } from '../models/Gallery';

const router = Router();

/**
 * GET /api/gallery/albums - 获取所有图片集
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const albums = await GalleryAlbumModel.findAll();
    
    // 如果没有封面，使用该集第一张图片
    for (const album of albums) {
      if (!album.cover_url) {
        const images = await GalleryModel.findByAlbumId(album.id);
        if (images.length > 0) {
          album.cover_url = images[0].img_url;
        }
      }
    }

    res.json({ success: true, data: albums });
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch albums' });
  }
});

/**
 * GET /api/gallery/albums/:id - 获取单个图片集详情
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const album = await GalleryAlbumModel.findById(id);

    if (!album) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }

    // 获取该图片集的所有图片
    const images = await GalleryModel.findByAlbumId(id);

    res.json({
      success: true,
      data: { ...album, images },
    });
  } catch (error) {
    console.error('Error fetching album:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch album' });
  }
});

/**
 * POST /api/gallery/albums - 创建图片集
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, description, cover_image_id } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    const album = await GalleryAlbumModel.create({ name, description, cover_image_id });
    res.status(201).json({ success: true, data: album });
  } catch (error) {
    console.error('Error creating album:', error);
    res.status(500).json({ success: false, message: 'Failed to create album' });
  }
});

/**
 * PUT /api/gallery/albums/:id - 更新图片集
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const album = await GalleryAlbumModel.update(id, req.body);

    if (!album) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }

    res.json({ success: true, data: album });
  } catch (error) {
    console.error('Error updating album:', error);
    res.status(500).json({ success: false, message: 'Failed to update album' });
  }
});

/**
 * DELETE /api/gallery/albums/:id - 删除图片集
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await GalleryAlbumModel.delete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Album not found' });
    }

    res.json({ success: true, message: 'Album deleted successfully' });
  } catch (error) {
    console.error('Error deleting album:', error);
    res.status(500).json({ success: false, message: 'Failed to delete album' });
  }
});

export default router;
