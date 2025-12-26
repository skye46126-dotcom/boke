import { NextRequest, NextResponse } from 'next/server';
import { ImageAssetModel } from '../../../../../../../lib/models/ImageAsset';
import { uploadToS3 } from '../../../../../../../lib/storage/s3';
import { uploadToLocal } from '../../../../../../../lib/storage/local';
import { generateMarkdownImage, extractAltFromFilename } from '../../../../../../../lib/utils/markdown';
import { withErrorHandler, withAdminAuth } from '../../../../../../../lib/middleware/validation';

/**
 * POST /api/manage/[adminPath]/upload/image - 上传图片
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
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // 验证文件大小 (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // 读取文件内容
    const buffer = await file.arrayBuffer();

    // 检查是否配置了有效的 AWS S3
    const useS3 = process.env.AWS_ACCESS_KEY_ID && 
                  process.env.AWS_SECRET_ACCESS_KEY && 
                  process.env.AWS_S3_BUCKET &&
                  process.env.AWS_ACCESS_KEY_ID !== 'your_access_key_id' &&
                  process.env.AWS_SECRET_ACCESS_KEY !== 'your_secret_access_key' &&
                  process.env.AWS_S3_BUCKET !== 'your_bucket_name';

    let uploadResult;
    
    if (useS3) {
      // 上传到 S3
      console.log('Uploading to S3...');
      uploadResult = await uploadToS3(file, buffer);
    } else {
      // 上传到本地存储
      console.log('Uploading to local storage...');
      uploadResult = await uploadToLocal(file, buffer);
    }

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
        markdown,
      },
      message: 'Image uploaded successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Image upload error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to upload image',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}));
