import { NextRequest, NextResponse } from 'next/server';
import { ImageAssetModel } from '../../../../../../lib/models/ImageAsset';
import { uploadToS3 } from '../../../../../../lib/storage/s3';
import { withErrorHandler, withAdminAuth } from '../../../../../../lib/middleware/validation';
import { generateMarkdownImage, extractAltFromFilename } from '../../../../../../lib/utils/markdown';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

/**
 * POST /api/manage/[adminPath]/upload - 上传图片（管理后台）
 */
export const POST = withAdminAuth(withErrorHandler(async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }

    // 验证文件类型
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // 读取文件内容
    const buffer = await file.arrayBuffer();

    // 上传到云存储
    const uploadResult = await uploadToS3(file, buffer);

    // 保存到数据库
    const imageAsset = await ImageAssetModel.create({
      filename: uploadResult.filename,
      original_name: file.name,
      url: uploadResult.url,
      size: uploadResult.size,
      mime_type: file.type,
    });

    // 生成 Markdown 语法
    const alt = extractAltFromFilename(file.name);
    const markdown = generateMarkdownImage(imageAsset.url, alt);

    return NextResponse.json({
      success: true,
      data: {
        id: imageAsset.id,
        url: imageAsset.url,
        filename: imageAsset.filename,
        size: imageAsset.size,
        markdown, // Markdown 语法
      },
      message: 'Image uploaded successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Image upload error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Failed to upload image' },
      { status: 500 }
    );
  }
}));

/**
 * GET /api/manage/[adminPath]/upload - 获取所有上传的图片（管理后台）
 */
export const GET = withAdminAuth(withErrorHandler(async (req: NextRequest) => {
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get('limit') || '50', 10);

  if (limit < 1 || limit > 100) {
    return NextResponse.json(
      { success: false, message: 'Invalid limit. Must be between 1 and 100' },
      { status: 400 }
    );
  }

  const images = await ImageAssetModel.findAll(limit);

  return NextResponse.json({
    success: true,
    data: images,
  });
}));