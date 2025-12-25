/**
 * 富文本文章 API 端点
 * GET /api/articles/[slug]/rich
 * 返回预处理的 HTML、目录、阅读时间和图片信息
 */

import { NextRequest, NextResponse } from 'next/server';
import { RichArticleModel } from '../../../../../../lib/models/RichArticle';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // 获取富文本文章
    const article = await RichArticleModel.findRichBySlug(slug);

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          error: 'Article not found',
        },
        { status: 404 }
      );
    }

    // 只返回已发布的文章（前台）
    if (article.status !== 'published') {
      return NextResponse.json(
        {
          success: false,
          error: 'Article not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error('Error fetching rich article:', error);
    
    // 降级策略：如果富文本处理失败，尝试返回普通文章
    try {
      const { ArticleModel } = await import('../../../../../../lib/models/Article');
      const article = await ArticleModel.findBySlug(params.slug);
      
      if (article && article.status === 'published') {
        // 返回基础文章，让客户端处理 Markdown
        return NextResponse.json({
          success: true,
          data: article,
          fallback: true, // 标记为降级响应
        });
      }
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
