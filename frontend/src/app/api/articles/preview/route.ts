/**
 * 文章预览 API 端点
 * POST /api/articles/preview
 * 用于编辑器实时预览富文本内容
 */

import { NextRequest, NextResponse } from 'next/server';
import { RichArticleModel } from '../../../../../lib/models/RichArticle';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { markdown } = body;

    if (!markdown) {
      return NextResponse.json(
        {
          success: false,
          error: 'Markdown content is required',
        },
        { status: 400 }
      );
    }

    // 预览富文本内容
    const preview = RichArticleModel.previewRichContent(markdown);

    return NextResponse.json({
      success: true,
      data: preview,
    });
  } catch (error) {
    console.error('Error generating preview:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate preview',
      },
      { status: 500 }
    );
  }
}
