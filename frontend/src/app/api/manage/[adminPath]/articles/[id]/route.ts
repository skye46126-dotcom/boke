import { NextRequest, NextResponse } from 'next/server';
import { ArticleModel } from '../../../../../../../lib/models/Article';
import { withErrorHandler, withAdminAuth, withValidation } from '../../../../../../../lib/middleware/validation';

/**
 * GET /api/manage/[adminPath]/articles/[id] - 根据 ID 获取文章详情（管理后台）
 */
export const GET = withAdminAuth(withErrorHandler(async (
  req: NextRequest,
  { params }: { params: { adminPath: string; id: string } }
) => {
  const { id } = params;

  // 验证 UUID 格式
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return NextResponse.json(
      { success: false, message: 'Invalid article ID format' },
      { status: 400 }
    );
  }

  const article = await ArticleModel.findById(id);

  if (!article) {
    return NextResponse.json(
      { success: false, message: 'Article not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: article,
  });
}));

/**
 * PUT /api/manage/[adminPath]/articles/[id] - 更新文章（管理后台）
 */
export const PUT = withAdminAuth(withValidation(withErrorHandler(async (
  req: NextRequest,
  { params }: { params: { adminPath: string; id: string } }
) => {
  const { id } = params;
  const body = await req.json();
  const { title, content, excerpt, status, slug } = body;

  // 验证 UUID 格式
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return NextResponse.json(
      { success: false, message: 'Invalid article ID format' },
      { status: 400 }
    );
  }

  // 检查文章是否存在
  const existingArticle = await ArticleModel.findById(id);
  if (!existingArticle) {
    return NextResponse.json(
      { success: false, message: 'Article not found' },
      { status: 404 }
    );
  }

  // 验证状态（如果提供）
  if (status && !['draft', 'published'].includes(status)) {
    return NextResponse.json(
      { success: false, message: 'Invalid status. Must be "draft" or "published"' },
      { status: 400 }
    );
  }

  // 如果更新 slug，检查是否已存在
  if (slug && slug !== existingArticle.slug) {
    const slugExists = await ArticleModel.slugExists(slug, id);
    if (slugExists) {
      return NextResponse.json(
        { success: false, message: 'Slug already exists. Please provide a unique slug.' },
        { status: 400 }
      );
    }
  }

  const article = await ArticleModel.update(id, {
    title,
    content,
    excerpt,
    status,
    slug,
  });

  return NextResponse.json({
    success: true,
    data: article,
    message: 'Article updated successfully',
  });
})));

/**
 * DELETE /api/manage/[adminPath]/articles/[id] - 删除文章（管理后台）
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
      { success: false, message: 'Invalid article ID format' },
      { status: 400 }
    );
  }

  const deleted = await ArticleModel.delete(id);

  if (!deleted) {
    return NextResponse.json(
      { success: false, message: 'Article not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: 'Article deleted successfully',
  });
}));