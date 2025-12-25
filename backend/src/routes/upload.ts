import { Router, Request, Response } from 'express';
import upload from '../middleware/upload';
import { uploadToS3 } from '../storage/s3';
import { ImageAssetModel } from '../models/ImageAsset';
import { asyncHandler } from '../middleware/errorHandler';
import { generateMarkdownImage, extractAltFromFilename } from '../utils/markdown';

const router = Router();

/**
 * POST /upload/image - 上传图片
 */
router.post(
  '/image',
  upload.single('image'),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    try {
      // 上传到云存储
      const uploadResult = await uploadToS3(req.file);

      // 保存到数据库
      const imageAsset = await ImageAssetModel.create({
        filename: uploadResult.filename,
        original_name: req.file.originalname,
        url: uploadResult.url,
        size: uploadResult.size,
        mime_type: req.file.mimetype,
      });

      // 生成 Markdown 语法
      const alt = extractAltFromFilename(req.file.originalname);
      const markdown = generateMarkdownImage(imageAsset.url, alt);

      res.status(201).json({
        success: true,
        data: {
          id: imageAsset.id,
          url: imageAsset.url,
          filename: imageAsset.filename,
          size: imageAsset.size,
          markdown, // Markdown 语法
        },
        message: 'Image uploaded successfully',
      });
    } catch (error) {
      console.error('Image upload error:', error);
      
      return res.status(500).json({
        success: false,
        message: 'Failed to upload image',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  })
);

/**
 * GET /upload/images - 获取所有上传的图片
 */
router.get(
  '/images',
  asyncHandler(async (req: Request, res: Response) => {
    const limit = parseInt(req.query.limit as string) || 50;
    const images = await ImageAssetModel.findAll(limit);

    res.json({
      success: true,
      data: images,
    });
  })
);

/**
 * DELETE /upload/images/:id - 删除图片记录
 * 注意：这只删除数据库记录，不删除云存储中的文件
 */
router.delete(
  '/images/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await ImageAssetModel.delete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
      });
    }

    res.json({
      success: true,
      message: 'Image record deleted successfully',
    });
  })
);

export default router;
