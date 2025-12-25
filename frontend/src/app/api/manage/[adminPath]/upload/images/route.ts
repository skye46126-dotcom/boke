import { NextRequest, NextResponse } from 'next/server';
import { ImageAssetModel } from '../../../../../../../lib/models/ImageAsset';
import { withErrorHandler, withAdminAuth } from '../../../../../../../lib/middleware/validation';

/**
 * GET /api/manage/[adminPath]/upload/images - 获取所有上传的图片
 */
export const GET = withAdminAuth(withErrorHandler(async (req: NextRequest) => {
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get('limit') || '50', 10);

  // 验证参数
  if (limit < 1 || limit > 100) {
    return NextResponse.json(
      { success: false, message: 'Invalid limit parameter (must be between 1 and 100)' },
      { status: 400 }
    );
  }

  const images = await ImageAssetModel.findAll(limit);

  return NextResponse.json({
    success: true,
    data: images,
  });
}));
