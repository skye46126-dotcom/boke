/* eslint-disable no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

/**
 * API 错误类
 */
export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

/**
 * 异步 API 处理器包装器
 */
export function withErrorHandler<T extends any[]>(
  handler: (_request: NextRequest, ..._parameters: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...parameters: T): Promise<NextResponse> => {
    try {
      return await handler(request, ...parameters);
    } catch (error) {
      console.error('API Error:', error);
      
      if (error instanceof ApiError) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: error.statusCode }
        );
      }
      
      return NextResponse.json(
        { success: false, message: 'Internal Server Error' },
        { status: 500 }
      );
    }
  };
}

/**
 * SQL 注入防护
 */
export function sanitizeInput(data: any): boolean {
  const sqlInjectionPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE)\b)/gi,
    /(;|--|\*\/|xp_|sp_)/gi,
    /(\bOR\b.*=.*|1=1|'=')/gi,
    /(\bAND\b.*=.*)/gi,
  ];

  const checkValue = (value: any): boolean => {
    if (typeof value === 'string') {
      return sqlInjectionPatterns.some(pattern => pattern.test(value));
    }
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(checkValue);
    }
    return false;
  };

  return checkValue(data);
}

/**
 * 输入验证装饰器
 */
export function withValidation<T extends any[]>(
  handler: (_request: NextRequest, ..._parameters: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...parameters: T): Promise<NextResponse> => {
    try {
      const body = await request.json().catch(() => ({}));
      const url = new URL(request.url);
      const query = Object.fromEntries(url.searchParams);
      
      // 检查 SQL 注入
      if (sanitizeInput(body) || sanitizeInput(query)) {
        console.warn('Potential SQL injection attempt detected', {
          url: request.url,
          method: request.method,
          body,
          query,
        });
        
        return NextResponse.json(
          { success: false, message: 'Invalid input detected' },
          { status: 400 }
        );
      }
      
      return await handler(request, ...parameters);
    } catch (error) {
      console.error('Validation error:', error);
      return NextResponse.json(
        { success: false, message: 'Validation failed' },
        { status: 400 }
      );
    }
  };
}

/**
 * 管理员权限验证
 */
export function withAdminAuth<T extends any[]>(
  handler: (_request: NextRequest, ..._parameters: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...parameters: T): Promise<NextResponse> => {
    const adminPath = process.env.ADMIN_PATH;
    const url = new URL(request.url);
    
    // 检查 URL 是否包含正确的管理路径
    if (!adminPath || !url.pathname.includes(adminPath)) {
      return NextResponse.json(
        { success: false, message: 'Not found' },
        { status: 404 }
      );
    }
    
    return await handler(request, ...parameters);
  };
}