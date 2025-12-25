import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

/**
 * 验证中间件 - 检查请求验证结果
 */
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.type === 'field' ? err.path : undefined,
        message: err.msg,
      })),
    });
  }
  
  next();
};

/**
 * SQL 注入防护 - 检测常见的 SQL 注入模式
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sqlInjectionPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE)\b)/gi,
    /(;|\-\-|\/\*|\*\/|xp_|sp_)/gi,
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

  // 检查 body, query, params
  const suspicious = 
    checkValue(req.body) || 
    checkValue(req.query) || 
    checkValue(req.params);

  if (suspicious) {
    console.warn('Potential SQL injection attempt detected', {
      ip: req.ip,
      path: req.path,
      method: req.method,
      userAgent: req.headers['user-agent'],
      body: req.body,
    });
    
    return res.status(400).json({
      success: false,
      message: 'Invalid input detected',
    });
  }

  next();
};

/**
 * XSS 防护 - 检测常见的 XSS 攻击模式
 */
export const xssProtection = (req: Request, res: Response, next: NextFunction) => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // onclick, onerror, etc.
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ];

  const checkValue = (value: any): boolean => {
    if (typeof value === 'string') {
      return xssPatterns.some(pattern => pattern.test(value));
    }
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(checkValue);
    }
    return false;
  };

  // 对于 Markdown 内容，我们允许某些 HTML 标签
  // 但仍然要检查危险的脚本
  const isMarkdownContent = req.body.content && req.path.includes('articles');
  
  if (!isMarkdownContent) {
    const suspicious = 
      checkValue(req.body) || 
      checkValue(req.query) || 
      checkValue(req.params);

    if (suspicious) {
      console.warn('Potential XSS attempt detected', {
        ip: req.ip,
        path: req.path,
        method: req.method,
      });
      
      return res.status(400).json({
        success: false,
        message: 'Invalid input detected',
      });
    }
  }

  next();
};

/**
 * 请求大小限制
 */
export const requestSizeLimit = (maxSize: number = 1024 * 1024) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);
    
    if (contentLength > maxSize) {
      return res.status(413).json({
        success: false,
        message: 'Request entity too large',
      });
    }
    
    next();
  };
};
