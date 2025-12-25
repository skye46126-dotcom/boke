import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

/**
 * 管理路径验证中间件
 * 验证请求是否来自正确的管理路径
 */
export const validateAdminPath = (req: Request, res: Response, next: NextFunction) => {
  const requestPath = req.path;
  const adminPath = `/${config.admin.path}`;

  // 检查路径是否以管理路径开头
  if (requestPath.startsWith(adminPath)) {
    // 移除管理路径前缀，继续处理
    req.url = req.url.replace(adminPath, '');
    return next();
  }

  // 如果不是管理路径，返回通用 404（不暴露管理接口存在）
  return res.status(404).json({
    success: false,
    message: 'Not found',
  });
};

/**
 * 管理员权限检查中间件
 * 用于保护管理 API 端点
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  // 检查请求头中的管理路径标识
  const adminPathHeader = req.headers['x-admin-path'];
  
  if (adminPathHeader !== config.admin.path) {
    // 返回通用 404，不暴露管理接口存在
    return res.status(404).json({
      success: false,
      message: 'Not found',
    });
  }

  next();
};

/**
 * 记录可疑的管理路径访问尝试
 */
export const logSuspiciousAccess = (req: Request, res: Response, next: NextFunction) => {
  const suspiciousPaths = [
    '/admin',
    '/administrator',
    '/wp-admin',
    '/backend',
    '/manage',
    '/dashboard',
    '/control-panel',
  ];

  const requestPath = req.path.toLowerCase();
  const isSuspicious = suspiciousPaths.some(path => requestPath.includes(path));

  if (isSuspicious) {
    console.warn('Suspicious admin access attempt:', {
      ip: req.ip,
      path: req.path,
      userAgent: req.headers['user-agent'],
      timestamp: new Date().toISOString(),
    });
  }

  next();
};
