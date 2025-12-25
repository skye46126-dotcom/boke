import { NextRequest, NextResponse } from 'next/server';
import { ImageAssetModel } from '../../../../../../../../lib/models/ImageAsset';
import { withErrorHandler, withAdminAuth } from '../../../../../../../../lib/middleware/validation';

/**
 * DELETE /api/manage/[adminPath]/upload/images/[id] - 删除图片记录
 * 注意：这只删除数据库记录，不删除云存储中的文件
 */
export const DELETE = withAdminAuth(withErrorHandler(async (
  req: NextRequest,
  { params }: { params: { adminPath: string; id: string } }
) => {
  const { id } = params;

  // 验证 UUID 格式
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return NextResponse.json(
      { success: false, message: 'Invalid image ID format' },
      { status: 400 }
    );
  }

  const deleted = await ImageAssetModel.delete(id);

  if (!deleted) {
    return NextResponse.json(
      { success: false, message: 'Image not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Image record deleted successfully',
  });
}));
