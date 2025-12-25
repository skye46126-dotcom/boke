import { NextRequest, NextResponse } from 'next/server';
import { ArticleModel } from '../../../../../../lib/models/Article';
import { withErrorHandler, withAdminAuth, withValidation } from '../../../../../../lib/middleware/validation';
import { generateSlug } from '../../../../../../lib/utils/slug';

/**
 * GET /api/manage/[adminPath]/articles - 获取所有文章（管理后台）
 */
export const GET = withAdminAuth(withErrorHandler(async () => {
  const articles = await ArticleModel.findAll();

  return NextResponse.json({
    success: true,
    data: articles,
  });
}));

/**
 * POST /api/manage/[adminPath]/articles - 创建新文章（管理后台）
 */
export const POST = withAdminAuth(withValidation(withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const { title, content, excerpt, status } = body;
  let { slug } = body;

  // 验证必填字段
  if (!title || !content || !status) {
    return NextResponse.json(
      { success: false, message: 'Missing required fields: title, content, status' },
      { status: 400 }
    );
  }

  // 验证状态
  if (!['draft', 'published'].includes(status)) {
    return NextResponse.json(
      { success: false, message: 'Invalid status. Must be "draft" or "published"' },
      { status: 400 }
    );
  }

  // 如果没有提供 slug，自动生成
  if (!slug) {
    slug = generateSlug(title);
  }

  // 检查 slug 是否已存在
  const slugExists = await ArticleModel.slugExists(slug);
  if (slugExists) {
    return NextResponse.json(
      { success: false, message: 'Slug already exists. Please provide a unique slug.' },
      { status: 400 }
    );
  }

  const article = await ArticleModel.create({
    title,
    slug,
    content,
    excerpt,
    status,
  });

  return NextResponse.json({
    success: true,
    data: article,
    message: 'Article created successfully',
  }, { status: 201 });
})));