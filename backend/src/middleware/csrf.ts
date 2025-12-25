import { Request, Response, NextFunction } from 'express';
import { randomBytes, createHash } from 'crypto';

// 简单的 CSRF token 存储（生产环境应使用 Redis 或数据库）
const tokenStore = new Map<string, { token: string; expires: number }>();

/**
 * 生成 CSRF token
 */
export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * 验证 CSRF token
 */
export function validateCSRFToken(token: string, sessionId: string): boolean {
  const stored = tokenStore.get(sessionId);
  
  if (!stored) {
    return false;
  }
  
  // 检查是否过期
  if (Date.now() > stored.expires) {
    tokenStore.delete(sessionId);
    return false;
  }
  
  return stored.token === token;
}

/**
 * CSRF 保护中间件
 */
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // 只对修改数据的请求进行 CSRF 检查
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const token = req.headers['x-csrf-token'] as string;
    const sessionId = req.headers['x-session-id'] as string || req.ip || 'default';
    
    if (!token || !validateCSRFToken(token, sessionId)) {
      console.warn('CSRF token validation failed', {
        ip: req.ip,
        path: req.path,
        method: req.method,
      });
      
      return res.status(403).json({
        success: false,
        message: 'Invalid or missing CSRF token',
      });
    }
  }
  
  next();
};

/**
 * 获取 CSRF token 的路由处理器
 */
export const getCSRFToken = (req: Request, res: Response) => {
  const sessionId = req.headers['x-session-id'] as string || req.ip || 'default';
  const token = generateCSRFToken();
  const expires = Date.now() + 60 * 60 * 1000; // 1 hour
  
  tokenStore.set(sessionId, { token, expires });
  
  res.json({
    success: true,
    data: { token },
  });
};

// 定期清理过期的 token
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, data] of tokenStore.entries()) {
    if (now > data.expires) {
      tokenStore.delete(sessionId);
    }
  }
}, 60 * 60 * 1000); // 每小时清理一次
